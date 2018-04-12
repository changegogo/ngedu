/**
 * Javask javascript tools
 * 本工具需要 jQuery 1.10 以上版本和 jQuery.ua 插件支持
 * 
 * @fileoverview engine.js
 * @author Javask
 * @version 3.0.2
 *
 * @update
 * 	2014-11-12( v3.0.1 ):
 * 		1. 增加启用复制( $().disableSelection() )和禁用复制( $().enableSelection() )扩展
 *  2015-02-12( v3.0.2 ):
 * 		1. 优化日期格式验证( javask.string.isDate() )和电子邮件格式验证( javask.string.isEmail() )函数的验证逻辑
 * 		2. 增加IP格式验证( javask.string.isIP() )和手机号码格式验证( javask.string.isMobile() )函数
 */

// "use strict";

var _javask = {};
if( $.type( javask ) != "undefined" ) {
	/*
	 * 如果 javask 不为 undefined
	 */
	// 将 javask 对象引用转存至 _javask
	_javask = javask;
	// 清空 javask
	javask  = {};
}else {
	/*
	 * 如果 javask 为 undefined
	 */
	var javask = {};
}

$.extend( javask , {
	/**
	 * 版本号
	 */
	 version       : "3.0.2"
	/**
	 * 浏览器相关命名空间
	 */
	,browser       : {}
	/**
	 * javask tools configuration namespace
	 */
	,config        : {}
	/**
	 * javask tools 自定义 UI 命名空间
	 */
	,ui            : {}
	/**
	 * javask tools 插件命名空间
	 */
	,plug          : {}
	/**
	 * 动态加载(CSS,JS)
	 */
	,imports       : {}
	,object        : {}
	/**
	 * 全局静态变量
	 */
	,global        : {}
	/**
	 * 字符串相关操作
	 */
	,string        : {}
	/**
	 * 数学运算相关
	 */
	,math          : {}
	/**
	 * HTML标签相关
	 */
	,tag           : {}
	/**
	 * URL相关
	 */
	,url           : {}
	,ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>"
	,JSONFilter    : /^\/\*-secure-([\s\S]*)\*\/\s*$/
	,N             : $.noop
	,K             : function( a ) {return a;}
	,T             : function() {return true;}
	,F             : function() {return false;}
} );

/***************************************************************************************************************************************************/
/**
 * 扩展 jQuery
 */
$.fn.extend( {
	
	/**
	 * 判断是否含有属性
	 * 
	 * @param attrName 属性名称
	 * @return Boolean
	 * @call $().hasAttr( attrName );
	 */
	hasAttr: function( attrName ) {
		
		return !javask.object.isUndefined( this.attr( attrName ) );
	}
	
	/**
	 * 元素是否被隐藏
	 * 有多个元素时,只要有一个元素为隐藏状态,即返回 true
	 * 
	 * @return Boolean
	 * @call $().isHidden();
	 */
	,isHidden: function() {
		
		var flag = false;
		
		// 遍历元素
		this.each( function( index , element ) {
			
			element = $( element );
			// 判断元素是否为隐藏状态
			flag = element.css( "display" ) == "none";
			// 如果元素为隐藏状态,直接退出循环
			if( flag ) {
				return false;
			}
		} );
		
		return flag;
	}
	
	/**
	 * 判断一个元素是否存在
	 *
	 * @return Boolean  返回true,说明元素存在,返回false,说明元素不存在
	 * @call $().exist();
	 */
	,exist: function() {
		
		return this.length > 0;
	}
	
	/**
	 * 禁止复制
	 * 
	 * @call $().disableSelect();
	 */
	,disableSelect: function() {
		if( javask.browser.ua.isIe ) {
			// IE浏览器
			this.bind( "selectstart dragstart copy" , javask.F );
		}else {
			// 非IE浏览器
			this.css( {
				"-moz-user-focus"    : "ignore",
				"-moz-user-input"    : "disabled",
				"-moz-user-select"   : "none",
				"-webkit-user-select": "none"
			} );
		}
		// 绑定屏蔽事件
		this.bind( "keydown" , javask.browser.screenCtrl );
		return this;
	}
	
	/**
	 * 启用复制
	 * 
	 * @call $().enableSelect()
	 */
	,enableSelect: function() {
		if( javask.browser.ua.isIe ) {
			// IE浏览器
			this.unbind( "selectstart dragstart copy" , javask.F );
		}else {
			// 非IE浏览器
			this.css( {
				"-moz-user-focus"    : "normal",
				"-moz-user-input"    : "auto",
				"-moz-user-select"   : "auto",
				"-webkit-user-select": "auto"
			} );
		}
		// 解除绑定屏蔽事件
		this.unbind( "keydown" , javask.browser.screenCtrl );
		return this;
	},
	
	/**
	 * 禁止复制
	 * 
	 * @call $().disableSelection();
	 */
	disableSelection: ( function() {
		var eventType = "onselectstart" in document.createElement( "div" )
						? "selectstart"
						: "mousedown";
		
		return function() {
			return this.bind( eventType + ".javask-disableSelection" , function( event ) {
				event.preventDefault();
			} );
		};
	} )(),
	
	/**
	 * 启用复制
	 * 
	 * @call $().enableSelection()
	 */
	enableSelection: function() {
		return this.unbind( ".javask-disableSelection" );
	}
	
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * javask.object
 */
$.extend( javask.object , {
	
	/**
	 * 判断是否HTML元素
	 * 
	 * @param object 需要检测的对象,一般为 document.getElementById() 的返回值
	 * @return Boolean
	 * @call javask.object.isElement( object );
	 */
	isElement: function( object ) {
		
		return object && object.nodeType == 1;
	}
	
	/**
	 * 判断是否为null
	 * 
	 * @param a 需要检测的对象
	 * @return Boolean
	 * @call javask.object.isNull( a );
	 */
	,isNull: function( a ) {
		
		return typeof a == "object" && !a;
	}
	
	/**
	 * 判断是否为字符串
	 * 
	 * @param object 需要检测的对象
	 * @return Boolean
	 * @call javask.object.isString( object );
	 */
	,isString: function( object ) {
		
		return typeof object == "string";
	}
	
	/**
	 * 判断是否为数字
	 * 
	 * @param object 需要检测的对象
	 * @return Boolean
	 * @call javask.object.isNumber( object );
	 */
	,isNumber: function( object ) {
		
		return typeof object == "number";
	}
	
	/**
	 * 判断是否为 undefined
	 * 
	 * @param object 需要检测的对象
	 * @return Boolean
	 * @call javask.object.isUndefined( object );
	 */
	,isUndefined: function( object ) {
		
		return typeof object == "undefined";
	}
	
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * 浏览器相关操作
 * javask.browser
 */
$.extend( javask.browser , {
	/**
	 * jQuery.ua
	 */
	ua: $.ua()
	
	/**
	 * 屏蔽键盘 Shift/Ctrl/Alt 键
	 * 
	 * @param event Event对象
	 * @call javask.browser.screenCtrl();
	 */
	,screenCtrl: function( event ) {
		
		// 获得当前按下的键值
		var code = event.which;
		// 屏蔽 Shift/Ctrl/Alt 键
		if( code == 16 || code == 17 || code == 18 ) {
			return javask.F();
		}
	}
	
	/**
	 * 设为首页,暂时只支持 IE
	 * 
	 * @param url 如果不指定,默认为页面当前地址
	 * @call javask.browser.setDefault();
	 */
	,setDefault: function( url ) {
		
		url = url || javask.url.get();

		if( document.all ) {
			document.body.style.behavior = "url(#default#homepage)";
			document.body.setHomePage( url );
		}else if( window.sidebar ) {
			if( window.netscape ) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege( "UniversalXPConnect" );
				}catch( e ) {
					alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" );
				}
			}
			var prefs = Components.classes[ "@mozilla.org/preferences-service;1" ].getService( Components.interfaces.nsIPrefBranch );
			prefs.setCharPref( "browser.startup.homepage" , url );
		}else {
			// alert( "浏览器不支持，请手动设置！" );
		}
		return false;
	}
	
	/**
	 * 加入收藏
	 * 
	 * @param title 标题
	 * @param url   收藏地址
	 * @call javask.browser.addBookMark( title , url );
	 */
	,addBookMark: function( title , url ) {
		
		title = title || document.title;
		url = url || javask.url.get();
		
		try {
			window.external.addFavorite( url , title );
		}catch( e ) {
			try {
				window.sidebar.addPanel( title , url , "" );
			}catch( e ) {
				// alert( "加入收藏失败,请手动添加！" );
			}
		}
		return false;
	}
	
	/**
	 * 禁止浏览器的 Javascript 错误提示
	 * 直接调用
	 * 
	 * @call javask.browser.clearError();
	 */
	,clearError: function() {
		
		$( window ).error( javask.T );
	}
	
	/**
	 * 判断浏览器是否支持某个CSS属性
	 * 
	 * @param  prop CSS属性名
	 * @return Boolean
	 * @call   javask.browser.cssSupports( prop );
	 */
	,cssSupports: ( function() {
		var  div     = document.createElement( 'div' )
			,vendors = "Khtml O Moz Webkit".split( " " )
			,len     = vendors.length
		;
		return function( prop ) {
			if( prop in div.style ) {
				return true;
			}
			if( '-ms-' + prop in div.style ) {
				return true;
			}
			prop = prop.replace( /^[a-z]/ , function( val ) {
				return val.toUpperCase();
			} );
			while( len-- ) {
				if( vendors[ len ] + prop in div.style ) {
					return true;
				}
			}
			return false;
		};
	} )()
	
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
$.extend( javask.browser , {
	
	/**
	 * 浏览器是否支持CSS属性
	 */
	css: {
		transition: javask.browser.cssSupports( "transition" )
	}
	
	/**
	 * 样式兼容
	 */
	,styleCompliant: {
		
		/**
		 * 去除tab和换行
		 * 
		 * @param container 存放需要去除tab和换行符的代码的容器
		 * @call  javask.browser.styleCompliant.splitTabAndLinkBreak( container );
		 */
		splitTabAndLinkBreak: function( container ) {
			
			var html = "";
			
			// 确保container是jQuery对象
			container = ( container instanceof jQuery ) ? container : $( container );
			
			container.each( function( index , _container ) {
				
				_container = $( _container );
				
				html = _container.html();
				
				html = javask.string.replaceAll( html , "\t" , "" );
				html = javask.string.replaceAll( html , "\n" , "" );
				html = javask.string.replaceAll( html , "\r" , "" );
				html = javask.browser.ua.isIe ? javask.string.replaceAll( html , "> <" , "><" ) : html;
				
				_container.html( html );
				
			} );
		}
	}
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * 字符串相关操作
 * javask.string
 */
$.extend( javask.string , {
	/**
	 * 清除所有标签
	 * 
	 * @param str 需要去除标签的字符串
	 * @call
	 * 		var str = "<div>aaa<li>cccc</li>bbb</div>";
	 * 		javask.string.clearTags( str )  ==>  "aaaccccbbb";
	 */
	clearTags: function( str ) {
		
		str = str || "";
		return str.replace( /<\/?[^>]+>/gi , "" );
	}
	
	/**
	 * 清除脚本
	 * 
	 * @param str 需要清除脚本的字符串
	 * @call 
	 * 		var str = '<script type="text/javascript">alert( 1 );</script>';
	 * 		javask.string.clearScripts( str )  ==>  "alert( 1 );"
	 */
	,clearScripts: function( str ) {
		
		str = str || "";
		return str.replace( new RegExp( javask.ScriptFragment , "img" ) , "" );
	}
	
	/**
	 * 过滤特殊符号
	 * &|<|>|'|"| |\n|\r
	 * 
	 * @param str 需要转义符号的字符串
	 * @return String
	 * @call 
	 * 		var str = "<li>hello</li>";
	 * 		javask.string.htmlReplace( str )  ==>  "&lt;li&gt;hello&lt;/li&gt;"
	 */
	,htmlReplace: function( str ) {
		
		str = str || "";
		return str.replace( /&/g , "&amp;" )
					.replace( /</g , "&lt;" )
					.replace( />/g , "&gt;" )
					.replace( "'" , "&#39;" )   // 单引号
					.replace( /"/g , "&#34;" )
					.replace( / /g , "&nbsp;" )
					.replace( /\n/g , "<br />" )
					.replace( /\r/g , "<br />" )
					.replace( /\t/g , "&nbsp;&nbsp;&nbsp;&nbsp;" );
	}
	
	/**
	 * 还原特殊符号
	 * &|<|>|'|"| |\n|\r
	 * 
	 * @param str 需要翻译符号的字符串
	 * @return String
	 * @call
	 * 		var str = "&lt;li&gt;hello&lt;/li&gt;";
	 * 		javask.string.htmlUnReplace( str )  ==>  "<li>hello</li>"
	 */
	,htmlUnReplace: function( str ) {
		
		str = str || "";
		return str.replace( "<br />" , "\n" )
						.replace( /&nbsp;&nbsp;&nbsp;&nbsp;/g , "\t" )
						.replace( /&nbsp;/g , " " )
						.replace( /&#34/g , "\"" )
						.replace( /&#39;"/ , "'" )
						.replace( /&gt;/g , ">" )
						.replace( /&lt;/g , "<" )
						.replace( /&amp;/g , "&" );
	}
	
	/**
	 * 过滤注入脚本
	 * 
	 * @param str 需要过滤脚本的字符串
	 * @call javask.string.scriptReplace( str );
	 */
	,scriptReplace: function( str ) {
		
		str = str || "";
		str = str.replace( /&#(\d+);?/g , function( a , b ) {
						return String.fromCharCode( b );
					} )
					.replace( /&#x(\d+);?/ig , function( a , b ) {
						return String.fromCharCode( parseInt( b , 16 ) );
					} )
					.replace( /(\Won)(\w+\s*=)/ig , "$1_$2" )
					.replace( /(\Wexpres)(sion\()/ig , "$1_$2" )
					.replace( /(\Wbehav)(ior\s*:)/ig , "$1_$2" )
					.replace( /(obj)(ect)/ig , "$1_$2" )
					.replace( /(scr)(ipt)/ig , "$1_$2" )
					.replace( /(emb)(ed)/ig , "$1_$2" )
					// .replace( /\<|\>|\,|\?|\[|\]|\{|\}|\~|\`|\!|\@|\#|\$|\%|\^|\*|\(|\)|\=|\+|\ /g , "" );
					.replace( /\?|\{|}|`|@|\$|%|\^|\*|\+| |--/g , "" );
					// .replace( /\n|\r/g , "<br/>" )
					// .replace( /\t/g , "&nbsp;&nbsp;&nbsp;&nbsp;" );
		return str;
	}
	
	/**
	 * 校验url地址合法性,一般用来判断get方式获得的url地址
	 * 
	 * @param url
	 * @return Boolean
	 * @call javask.string.validURL( url );
	 */
	,vaildURL: function( url ) {
		
		url = url || "";
		
		if( /javascript/ig.test( url ) ) {
			return false;
		}

		return !(/^http/ig.test( url ) && !( /^http:\/\/([\w\.]+)\.(jframe.com|jframe.cn|jframe.net|jframe.org|jframe.com.cn)/ig.test( url ) ));

	}
	
	/**
	 * 过滤关键脚本 ( Location , onload , meta , iframe , cookie , craker , innerHTML , object , script , insert , update , delete , select )
	 * 
	 * @param str
	 * @return String
	 * @call javask.string.scriptSearch( str );
	 */
	,scriptSearch: function( str ) {
		
		str = str || "";
		
		var  regString = "Location|onload|meta|iframe|cookie|craker|innerHTML|object|script|insert|update|delete|select"
			,reg       = new RegExp( regString , "gi" )
		;
		return str.match( reg );
	}
	
	/**
	 * 将字符串转换成数组
	 * 
	 * @param str 需要转成数组的字符串
	 * @call
	 * 		var a = "abcd";
	 *		javask.string.toArray( a )   ==>  [ 'a' , 'b' , 'c' , 'd' ]
	 */
	,toArray: function( str ) {
		
		str = str || "";
		
		return str.split( "" );
	}
	
	/**
	 * 检测字符串中是否包含某个字符串或字符
	 * 
	 * @param str 需要检测的字符串
	 * @param pattern 包含的字符或字符串
	 * @return Boolean
	 * @call javask.string.include( str , pattern );
	 */
	,include: function( str , pattern ) {
		
		str = str || "";
		
		return str.indexOf( pattern ) > -1;
	}
	
	/**
	 * 检测字符串是否以某字符或字符串开头
	 * 
	 * @param str 需要检测的字符串
	 * @param pattern
	 * @return Boolean
	 * @call javask.string.startWith( str , pattern );
	 */
	,startWith: function( str , pattern ) {
		
		str = str || "";
		
		return str.indexOf( pattern ) === 0;
	}
	
	/**
	 * 检测字符串是否以某字符或字符串结尾
	 * 
	 * @param str 需要检测的字符串
	 * @param pattern
	 * @return Boolean
	 * @call javask.string.endWith( str , pattern );
	 */
	,endWith: function( str , pattern ) {
		
		str = str || "";
		
		var d = str.length - pattern.length;
		
		return d >= 0 && str.lastIndexOf( pattern ) === d;
	}
	
	/**
	 * 字符串是否为空
	 * 
	 * @param str 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.empty( "" )   ==>  true
	 */
	,empty: function( str ) {
		
		return str == "";
	}
	
	/**
	 * 字符串是否为空字符串(检测空格)
	 * 
	 * @param str 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.blank( "" )   ==>  true
	 */
	,blank: function( str ) {
		
		str = str || "";
		
		return /^\s*$/.test( str );
	}
	
	/**
	 * 将 jQuery 的 trim 函数转储
	 */
	,trims: $.trim
	
	/**
	 * 去除多余空格
	 * 
	 * @param str 需要去除空格的字符
	 * @param flag 控制 "" , "all" , "left" , "right"
	 * @return String
	 * @call
	 * 		javask.string.trim( "      a    d    " );   ==>   "a    d"
	 * 		javask.string.trim( "      a    d    " , "all" );   ==>   "a    d"
	 * 		javask.string.trim( "      a    d    " , "left" );   ==>   "a    d    "
	 * 		javask.string.trim( "      a    d    " , "right" );   ==>   "      a    d"
	 */
	,trim: function( str , flag ) {
		
		flag = flag || "all";
		var strs = "";
		
		switch( flag ) {
			case "all"  : strs = javask.string.trims( str ); break;
			case "left" : strs = str.replace( /(^[\s]*)/g , "" ); break;
			case "right": strs = str.replace( /([\s]*$)/g , "" ); break;
		}
		return strs;
	}
	
	/**
	 * URL 编码
	 * 
	 * @param str 需要编码的字符
	 * @call javask.escape( " " )   ==>  "%20"
	 */
	,escape: function( str ) {
		return escape( str );
	}
	
	/**
	 * URL 反编码
	 * 
	 * @param str 需要反编码的字符
	 * @call javask.escape( "%20" )   ==>  " "
	 */
	,unescape: function( str ) {
		return unescape( str );
	}
	
	/**
	 * 去除单位,并将字符转换为数字
	 * 
	 * @param str 需要操作的字符串
	 * @param unit 单位名称,默认为 "px"
	 * @call
	 * 		javask.string.s2n( "*px" )  ==> *
	 * 		var a = "33px" , b = "3em";
	 * 		javask.string.s2n( a ) == javask.string.s2n( a , "px" )  ==>  33
	 * 		javask.string.s2n( b , "em" )  ==> 3
	 */
	,s2n: function( str , unit ) {
		
		unit = unit || "px";
		
		var re = new RegExp( unit + "$" , "i" );
		return parseInt( str.replace( re , "" ) , 10 );
	}
	
	/**
	 * 实现 replaceAll 功能
	 * 
	 * @param str 需要替换的字符串
	 * @param s
	 * @param t
	 * @return String
	 * @call javask.string.replaceAll( "aabbccbb" , "bb" , "&" );   ==>  [ "aa" , "cc" , "" ]  ==> "aa&cc&"
	 */
	,replaceAll: function( str , s , t ) {
		
		str = str || "";
		
		return str.split( s ).join( t );
	}
	
	/**
	 * 返回字符串的 ASCII 长度
	 * 
	 * @param str 需要确认长度的字符串
	 * @return Integer
	 * @call javask.string.asclen( str );
	 */
	,asclen: function( str ) {
		
		str = str || "";
		
		return str.replace( /[\u0100-\uffff]/g , "  " ).length;
	}
	
	/**
	 * 截取字符串(包括中文)
	 * 
	 * @param str 需要截取的字符串
	 * @param len 需要截取的字符串长度
	 * @return String
	 * @call javask.string.cut( "你好吗" , 3 ) == "你好"
	 */
	,cut: function( str , len ) {
		
		str = str || "";

		var  strlen = 0
			,s = ""
			,length = 0
		;

		length = str.length;
		for( var i = 0; i < str.length; i++ ) {
			
			str.charCodeAt( i ) > 128 ? strlen += 2 : strlen++;
			
			s += str.charAt( i );
			
			if( strlen >= len ) {
				
				return s ;
			}
		}
		return s;
	}
	
	/**
	 * 判断是否数字
	 * 
	 * @param str 需要判断的字符串
	 * @param flag 
	 *        +  正数
	 *        -  负数
	 *        i  整数
	 *        +i 正整数
	 *        -i 负整数
	 *        f  浮点数
	 *        +f 正浮点数
	 *        -f 负浮点数
	 * @return {Boolean}
	 * @call javask.string.isNumber( "" , flag );
	 */
	,isNumber: function( str , flag ) {
		
		if( isNaN( str ) ) {
			return false;
		}
		
		switch( flag ) {
			case null:                                                  // 数字
			case ""  :
			case "+" : return /(^\+?|^\d?)\d*\.?\d+$/.test( str );      // 正数
			case "-" : return /^-\d*\.?\d+$/.test( str );               // 负数
			case "i" : return /(^-?|^\+?|\d)\d+$/.test( str );          // 整数
			case "+i": return /(^\d+$)|(^\+?\d+$)/.test( str );         // 正整数
			case "-i": return /^[-]\d+$/.test( str );                   // 负整数
			case "f" : return /(^-?|^\+?|^\d?)\d*\.\d+$/.test( str );   // 浮点数
			case "+f": return /(^\+?|^\d?)\d*\.\d+$/.test( str );       // 正浮点数
			case "-f": return /^[-]\d*\.\d$/.test( str );               // 负浮点数
			default  : return true;                                     // 缺省
		}
	}

	/**
	 * 另一个判断是否为整形的方法
	 *
	 * @param str 需要判断是否为数字的字符串
	 * @return Boolean
	 * @call javask.string.isNum( str )
	 */
	,isNum: function( str ) {

		str = str || "";

		var numChars = "1234567890.",
			i;

		for( i = 0; i < str.length; i ++ ) {

			if( numChars.indexOf( str.charAt( i ) ) == -1 ) {

				return false;
			}
		}
		return true;
	}
	
	/**
	 * 判断是否日期
	 * 
	 * @param str 需要判断是否为日期的字符串
	 * @return Boolean
	 * @call javask.string.isDate( str )
	 */
	,isDate: function( str ) {

		// var datereg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
		var datereg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|([1-2][0-3])):([0-5]?[0-9])((\s)|(:([0-5]?[0-9])))))?$/;

		return datereg.test( str );
	}
	
	/**
	 * 是否允许使用某些字符
	 * 
	 * @param isAllowLetter  是否允许使用大小写字母
	 * @param isAllowNumber  是否允许使用数字
	 * @param allowOfCharacters  允许使用的字符,可弹性增加
	 * @return Boolean
	 * @call
	 * 		$().keypress( function( e ) {
	 * 			return javask.string.textInputKeyPress( e , true , true , "-" );
	 * 		} );
	 **/
	,textInputKeyPress: function( e , isAllowLetter , isAllowNumber , allowOfCharacters ) {
		
		var keyCode = e.keyCode > 0 ? e.keyCode : e.which,
			i , argLength = arguments.length;
			
		if( keyCode == 13 || keyCode == 8 || keyCode == 9 ) {
			
			// 输入键为 回车,空格,Tab
			return true;
		}
		
		if( isAllowLetter && ( ( keyCode >= 65 && keyCode <= 90 ) || ( keyCode >= 97 && keyCode <= 122 ) ) ) {
			return true;
		}
		
		if( isAllowNumber && ( keyCode >= 48 && keyCode <= 57 ) ) {
			return true;
		}
		
		if( argLength > 3) {
			for( i = 3 ; i < argLength ; i++) {
				if( arguments[ i ].length == 1 && arguments[ i ].charCodeAt() == keyCode ) {
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * 判断字符串是否为纯英文
	 * 
	 * @param text 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.textEng( text );
	 */
	,textEng: function( text ) {
		
		text = text || "";
		
		var engReg = /^[a-zA-Z]+$/;
		
		return text.match( engReg ) != null;

	}
	
	/**
	 * 判断字符串是否为英文和数字组成
	 * 
	 * @param text 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.textEngNum( text );
	 **/
	,textEngNum: function( text ) {
		
		text = text || "";
		var engNumReg = /^[a-zA-Z0-9]+$/;

		return text.match( engNumReg ) != null;
	}
	
	
	/**
	 * 判断是否为数字
	 * 
	 * @param text 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.checkInt( text );
	 */
	,checkInt: function( text ) {
		
		text = text || "";
		
		var rgex = /^[0-9]*[0-9][0-9]*$/;

		return rgex.test( text );
	}
	
	/**
	 * 判断是否为浮点数
	 * 
	 * @param text 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.checkFloat( text );
	 */
	,checkFloat: function( text ) {
		
		text = text || "";
		
		var rgex = /^[0-9]*[0-9][0-9]*\.?\d*$/;
		
		return rgex.test( text );
	}
	
	/**
	 * 判断是否为email地址
	 * 
	 * @param str 需要检测的字符串
	 * @return Boolean
	 * @call javask.string.isEmail( str );
	 */
	,isEmail: function( str ) {
		
		str = str || "";
		
		// var email = /^[0-9a-zA-Z-_]+@[0-9a-zA-Z-_]+(\.[0-9a-zA-Z-_]+)+$/;
		var email = /^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][A-Za-z]{2,3}([\.][A-Za-z]{2})?$/;
		
		return email.test( str );
	}

	/**
	 * 判断字符串是否是一个 IP 地址
	 * 
	 * @param ip
	 * @return Boolean
	 * @call javask.string.isIP( ip );
	 */
	,isIP: function( ip ) {
	
		// String regex = "(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)){3}";
		var regex = /\b((?!\d\d\d)\d+|1\d\d|2[0-4]\d|25[0-5])\.((?!\d\d\d)\d+|1\d\d|2[0-4]\d|25[0-5])\.((?!\d\d\d)\d+|1\d\d|2[0-4]\d|25[0-5])\.((?!\d\d\d)\d+|1\d\d|2[0-4]\d|25[0-5])\b/;
		
		return regex.test( ip );
	}

	/**
	 * 判断字符串是否是一个正确的手机号码<br/>
	 * 根据实际开发于2009年9月7日最新统计：<br/>
	 * 中国电信发布中国3G号码段:<br/>
	 * <p>
	 * 中国联通185,186;中国移动188,187;中国电信189,180共6个号段。
	 * </p>
	 * 3G业务专属的180-189号段已基本分配给各运营商使用<br/>
	 * <p>
	 * 其中180、189分配给中国电信,187、188归中国移动使用,185、186属于新联通。
	 * </p>
	 * <ul>
	 * <li>中国移动拥有号码段：139、138、137、136、135、134、159、158、157（3G）、152、151、150、188（3G）、187（3G）;14个号段</li>
	 * <li>中国联通拥有号码段：130、131、132、155、156（3G）、186（3G）、185（3G）;6个号段</li>
	 * <li>中国电信拥有号码段：133、153、189（3G）、180（3G）;4个号码段</li>
	 * </ul>
	 * 移动:
	 * <ul>
	 * <li>2G号段(GSM网络)有139,138,137,136,135,134(0-8),159,158,152,151,150</li>
	 * <li>3G号段(TD-SCDMA网络)有157,188,187</li>
	 * <li>147是移动TD上网卡专用号段.</li>
	 * </ul>
	 * 联通:
	 * <ul>
	 * <li>2G号段(GSM网络)有130,131,132,155,156</li>
	 * <li>3G号段(WCDMA网络)有186,185</li>
	 * </ul>
	 * 电信:
	 * <ul>
	 * <li>2G号段(CDMA网络)有133,153</li>
	 * <li>3G号段(CDMA网络)有189,180</li>
	 * </ul>
	 * 
	 * @param mobile
	 * @return Boolean
	 * @call javask.string.isMobile( mobile );
	 */
	,isMobile: function( mobile ) {
	
		var regex = /^((13[0-9])|(14[7])|(15[^4,\D])|(18[0,5-9]))\d{8}$/;
		
		return regex.test( mobile );
	}
	
	/**
	 * 计算字符串的字节长度，即英文算一个，中文算两个字节
	 * 调用方法: $.lengthByByte ( "" );
	 * 
	 * @param str 需要计算长度的字符串
	 * @return Integer
	 */
	,lengthByByte: function( str ) {
		
		str = str || "";
		
		var len = 0 , length = str.length;
		
		for( var i = 0; i < length; i ++ ) {
			
			if( str.charCodeAt( i ) > 255 ) {
				len += 2;
			}else {
				len ++;
			}
		}
		return len;
	}
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * Math 相关操作
 */
$.extend( javask.math , {
	
	/**
	 * 生成随机数
	 * 
	 * @param num 随机数因子
	 * @call javask.math.rand( num );
	 */
	rand: function( num ) {

		num =  Math.random();
		var rnum = Math.round( Math.random() * 11 ) / num * 0.1;
		
		if( rnum == 0 ) {
			rnum = javask.math.rand( num );
		}
		return rnum;
	}
	
	/**
	 * 生成 [ 0 , nMax ) 的随机整数
	 * 
	 * @param nMax 最大值
	 * @return Integer
	 * @call javask.math.randomInt( 10 );
	 */
	,randomInt: function( nMax ) {
		
		return parseInt( Math.random() * nMax );
	}
	
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * URL相关
 * javask.url
 */
$.extend( javask.url , {
	/**
	 * 获取浏览器当前页面的 URL
	 * 
	 * @return string
	 * @call javask.url.get();
	 */
	get: function() {
		
		return location.href;
	}
	
	/**
	 * 获取URL中的参数值
	 * 
	 * @param parameter 参数名称
	 * @param url 需要获取参数值的URL
	 * @return String
	 * @call javask.url.getParameter( parameter , url );
	 */
	,getParameter: function( parameter , url ) {
		
		url = url || javask.url.get();
		
		return javask.object.isNull( url.match( new RegExp( "[?#&]" + parameter + "=(.*?)(?:[#&]|$)" , "i" ) ) ) ? "" : RegExp.$1;
	}
	
	/**
	 * 获取文件的后缀名
	 * 
	 * @param url 需要获取文件后缀名的URL
	 * @return String
	 * @call javask.url.getSuffix( url );
	 */
	,getSuffix: function( url ) {
		
		url = url || javask.url.get();
		
		var dot = url.lastIndexOf( "." );
		
		return dot == -1 ? "" : url.substr( dot + 1 );
	}
	
	/**
	 * 获取访问类型(http/https)
	 * 
	 * @param url 需要获取访问类型的URL
	 * @return String
	 * @call javask.url.getProtocol( url );
	 */
	,getProtocol: function( url ) {
		
		url = url || javask.url.get();
		
		return javask.object.isNull( url.match( /^(\w+):\/\// ) ) ? "" : RegExp.$1;
	}
	
	/**
	 * 获取主机名(域名)
	 * 
	 * @param url 需要获取主机名的URL
	 * @return String
	 * @call javask.url.getHost( url );
	 */
	,getHost: function( url ) {
		
		url = url || javask.url.get();
		
		return javask.object.isNull( url.match( /:\/\/([a-zA-Z0-9.]+)/) ) ? "" : RegExp.$1;
	}

	,isValid: function( url ) {

		// noinspection SillyAssignmentJS
		url = url;

		return true;
	}
	
	/**
	 * 判断是否为本机路径
	 * 
	 * @param url
	 * @return Boolean
	 * @call javask.url.isLocal( url );
	 */
	,isLocal: function( url ) {
		
		url = url || javask.url.get();
		
		return !javask.object.isNull( url.match( /(^file|^[A-Za-z]):/i) );
	}
	
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * 快捷操作
 */
$.extend( {
	/**
	 * 获取 URL 参数
	 * 
	 * @call $.p( name , url );
	 */
	p: javask.url.getParameter
	
	/**
	 * 防止页面在其他 Web 站点的框架中显示
	 * 
	 * @call $.blockPing();
	 */
	,blockPing: function() {
		if( top != self ) {
			top.location = location;
		}
	}
	
	/**
	 * 无确认关闭页面
	 * window.opener = null 不是为 opener 赋值,而是置 window.opener 为空,使之成为 Object 类型
	 * 
	 * @call $.c();
	 */
	,c: function() {
		window.opener = null;
		window.close();
	}
	
	/**
	 * 居中打开窗口
	 * 
	 * @param strUrl 窗口的页面地址
	 * @param strName 窗口的名称
	 * @param nWidth 窗口宽度
	 * @param nHeight 窗口高度
	 */
	,$open: function( strUrl , strName , nWidth , nHeight ) {
		
		var strFeature;
		
		strFeature = "height=" + nHeight + ",width=" + nWidth + "";
		strFeature += ",left=" + ( ( screen.availWidth - nWidth ) / 2 );
		strFeature += ",top=" + ( ( screen.availHeight - nHeight ) / 2 );
		strFeature += ",toolbar=no,scrollbars=yes,menubar=no,resizable=no,directories=no";
		
		return window.open( strUrl , strName , strFeature );
	}
	
	/**
	 * 页面转向
	 * 
	 * @param url 需要转向的 URL
	 * @call $.go( url );
	 */
	,go: function( url ) {
		location.href = url;
	}
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * imports
 */
$.extend( javask.imports , {
	/**
	 * 动态加载 CSS 文件
	 * 
	 * @param url CSS文件URL
	 * @param cssID <link /> 标签的ID
	 * @call javask.imports.loadCSS( url , cssID );
	 */
	loadCSS: function( url , cssID ) {
		
		// cssID = cssID || ( "CSS_" + javask.math.rand() );
		
		var head     = $( "head" ),
			linkList = $( "link" ),
			css;
		
		linkList.each( function( index , link ) {
			
			link = $( link );
			
			if( !javask.string.blank( link.attr( "href" ) ) && javask.string.include( link.attr( "href" ) , url ) ) {
				css = link;
				return false;
			}
		} );
		
		// 如果不存在相同CSS文件
		if( javask.object.isUndefined( css ) ) {
			
			css = javask.tag.css().attr( {
				"id"  : cssID,
				"href": url
			} ).appendTo( head );
		}
		
		return css;
	}

	/**
	 * 动态加载 javascript 文件
	 * 
	 * @param url JS文件的URL
	 * @param jsID <script />标签的ID
	 * @call javask.imports.loadJS( url , jsID );
	 */
	,loadJS: function( url , jsID ) {
		
		// jsID = jsID || ( "JS_" + javask.math.rand() );
		
		var head       = $( "head" ),
			scriptList = $( "script" ),
			js;
		
		scriptList.each( function( index , script ) {
			
			script = $( script );
			
			if( !javask.string.blank( script.attr( "src" ) ) && javask.string.include( script.attr( "src" ) , url ) ) {
				js = script;
				return false;
			}
		} );
		
		js = javask.tag.jscript().attr( {
			"id" : jsID,
			"src": url
		} ).appendTo( head );
		
		return js;
	}
	/**
	 * 共用加载
	 * 
	 * @param flag
	 * @param url 资源地址
	 * @param id 资源ID,可省略
	 * @call
	 * 		css: javask.imports._import( "css" , url , id );
	 * 		js : javask.imports._import( "js" , url , id );
	 */
	,_import: function( flag , url , id ) {
		
		if( javask.object.isNull( url ) || javask.string.blank( url ) ) {
			return;
		}
		
		id = id || flag.toUpperCase() + javask.math.rand().toString().replace( /\./ , "" );

		switch( flag ) {
			case "js" : return javask.imports.loadJS( url , id );
			case "css": return javask.imports.loadCSS( url , id );
		}
	}
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * Tag
 */
$.extend( javask.tag , {
	 link   : function() {return $( "<link />" );}
	,css    : function() {return javask.tag.link().attr( {rel: "stylesheet",type: "text/css"} );}
	,script : function() {return $( "<script />" );}
	,jscript: function() {return javask.tag.script().attr( {type: "text/javascript"} );}
	,div    : function() {return $( "<div />" );}
	,span   : function() {return $( "<span />" );}
	,samp   : function() {return $( "<samp />" );}
	,p      : function() {return $( "<p />" );}
	,label  : function() {return $( "<label />" );}
	,a      : function() {return $( "<a />" );}
	,jsa    : function() {return javask.tag.a().attr( {href: "javascript:void(0);"} );}
	,ul     : function() {return $( "<ul />" );}
	,li     : function() {return $( "<li />" );}
	,input  : function( type , id ) {return $( "<input type=\"" + type + "\" id=\"" + id + "\" name=\"" + id + "\" />" );}
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
$.extend( javask , {
	_import : javask.imports._import
} );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * 加载配置文件
 */
javask.imports._import( "js" , ( function() {
	var js , urlVersion = "engine-" + javask.version + ".js";
	$( "script" ).each( function( index , script ) {
		script = $( script );
		if( javask.string.include( script.attr( "src" ) , urlVersion ) ) {
			js = script;
			return false;
		}
	} );
	if( !javask.object.isUndefined( js ) ) {
		return js.attr( "src" ).replace( urlVersion , "config-" + javask.version + ".js" );
	}
	return null;
} )() , "Javask_Config" );
/***************************************************************************************************************************************************/

/***************************************************************************************************************************************************/
/**
 * 兼容 console.log()
 */
if( javask.object.isUndefined( window.console ) ) {
	window.console = {
		log: javask.N
	};
}
/***************************************************************************************************************************************************/