/**
 * 命名空间声明
 * 
 * @fileoverview L.js
 * @author lengchao
 * @version 1.0
 */

// iframe 中的 dialog 处理
if( typeof dialog == "undefined" ) {
	
	// 如果 dialog 为 undefine
	try {
		dialog = top.dialog;
	}catch( e ) {
		dialog = javask.N;
	}
}

// 定义命名空间
var L = {};
L.config = {};

// L.config
$.extend( L.config , {

	/**
	 * 开发者模式开关
	 */
	 developer: true
	/**
	 * 页大小
	 */
	,pageSize: 10
	/**
	 * 默认打开第几个菜单
	 */
	,defaultMenuNumber: 1
	/**
	 * 系统根目录<br/>
	 * 设置时,推荐使用 setURL( url )
	 */
	,url: ""
	
	/**
	 * 对话框相关
	 */
	,dialog: {
		/**
		 * 对话框标题 - 系统提示
		 */
		 TITLE : "系统提示"
		/**
		 * 对象框保存按钮文字 - 保存
		 */
		,SAVE  : "保存"
		/**
		 * 对话框确认按钮文字 - 确定
		 */
		,OK    : "确定"
		/**
		 * 对话框取消按钮文字 - 取消
		 */
		,CANCEL: "取消"
		/**
		 * 对话框关闭按钮文字 - 关闭
		 */
		,CLOSE : "关闭"
	}
	
	/**
	 * 系统时间格式化字符串<br/>
	 * 完整时间: yyyy-MM-dd HH:mm:ss
	 */
	,SYSTEM_DATE_PATTERN_DATETIME: "yyyy-MM-dd HH:mm:ss"
	/**
	 * 系统时间格式化字符串<br/>
	 * 日期: yyyy-MM-dd
	 */
	,SYSTEM_DATE_PATTERN_DATE: "yyyy-MM-dd"
	/**
	 * 系统时间格式化字符串<br/>
	 * 时间: HH:mm:ss
	 */
	,SYSTEM_DATE_PATTERN_TIME: "HH:mm:ss"
	/**
	 * 列表排序字段模板
	 */
	,HTML_LIST_SORTNUMBER: '<input id="{id}" name="{name}" type="text" value="{value}" class="field_text sort" />'
	/**
	 * 列表布尔字段模板
	 */
	,HTML_LIST_BOOLEAN: '<span class="icon_{value}"></span>'

} );

// L
$.extend( L , {

	/**
	 * 设置系统根目录
	 */
	 setUrl: function( url ) {
		
		url = url || "";
		
		var jsessionid = ";jsessionid=";
		
		// 不为空才进行处理
		if( !javask.string.empty( url ) ) {
			
			// 禁止 url 中包含 jsessionid
			if( javask.string.include( url , jsessionid ) ) {
				
				url = url.substring( 0 , url.indexOf( jsessionid ) );
			}
			
			// 禁止 url 以 / 结尾
			if( javask.string.endWith( url , "/" ) ) {
				
				url = url.substring( 0 , url.length - 1 );
			}
		}
		
		this.url = url;
	}
	/**
	 * 日志
	 */
	,log: function( message ) {
		L.config.developer && console.log( message );
	}
	/**
	 * 执行字符串表示的 JS 语句
	 */
	,eval: $.globalEval
	/**********************************************************************************************************/
	/**
	 * 内容显示框
	 * 
	 * @param message 需要提示的信息
	 * @call L.info( message );
	 */
	,info: function( message , title ) {

		if( javask.object.isUndefined( message ) || javask.string.blank( message ) ) {
			return null;
		}

		if( javask.object.isUndefined( title ) ) {
			title = "信息展示";
		}

		var info = dialog( {
			 id         : "L.InfoDialog"
			,padding    : "40px"
			,title      : title
			,content    : '<div style="min-width:200px; max-width:700px;">' + message + '</div>'
			,cancelValue: L.config.dialog.CLOSE
			,cancel     : javask.N
		} );

		return info.showModal();
	}
	/**
	 * 提示对话框
	 * 
	 * @param message  需要提示的信息
	 * @param callback 回调函数
	 * @call L.alert( message [ , callback ] );
	 */
	,alert: function( message , callback ) {
		
		if( javask.object.isUndefined( message ) || javask.string.blank( message ) ) {
			return null;
		}
		
		callback = callback || javask.N;
		
		var alert = dialog( {
			 id     : "L.AlertDialog"
			,skin   : "warning"
			,zIndex : 30000
			,title  : L.config.dialog.TITLE
			,content: message
			,okValue: L.config.dialog.OK
			,ok     : callback
		} );
		
		return alert.showModal();
	}
	/**
	 * 确认对话框
	 * 
	 * @param message 需要提示的信息
	 * @param ok      确认按钮事件
	 * @param cancel  取消按钮事件
	 * @call L.confirm( message [ , ok , cancel ] );
	 */
	,confirm: function( message , ok , cancel ) {
		
		if( javask.object.isUndefined( message ) || javask.string.blank( message ) ) {
			return null;
		}
		
		ok = ok || javask.N;
		cancel = cancel || javask.N;
		
		var confirm = dialog( {
			 id         : "L.ConfirmDialog"
			,skin       : "question"
			,zIndex     : 30000
			,title      : L.config.dialog.TITLE
			,content    : message
			,okValue    : L.config.dialog.OK
			,cancelValue: L.config.dialog.CANCEL
			,ok         : ok
			,cancel     : cancel
		} );
		
		return confirm.showModal();
	}
	/**
	 * 提问
	 * 
	 * @param message  提问内容
	 * @param yes      回调函数. 接收参数：输入值
	 * @param _default 默认值
	 * @call L.prompt( message [ , yes , _default ] );
	 */
	,prompt: function( message , yes , _default ) {
		
		if( javask.object.isUndefined( message ) || javask.string.blank( message ) ) {
			return null;
		}
		
		yes = yes || javask.N;
		
		var content = $(
				[
					 '<label for="L_DIALOG_PROMPT_INPUT" style="margin-bottom:15px;display:block;">'
						,message
					,'</label>'
					,'<div>'
					,'<input type="text" id="L_DIALOG_PROMPT_INPUT" autofocus="autofocus" value="'
						,_default
					,'" class="field_text" style="width:18em;" />'
					,'</div>'
				].join( "" )
			)
			,prompt  = dialog( {
				 id         : "L.PromptDialog"
				,skin       : "question"
				,zIndex     : 30000
				,title      : L.config.dialog.TITLE
				,content    : content
				,okValue    : L.config.dialog.OK
				,cancelValue: L.config.dialog.CANCEL
				,ok         : function() {
					
					var val = content.find( ".field_text" ).val();
					
					yes( val );
				}
				,onshow     : function() {
					
					content.find( ".field_text" ).focus().select();
				}
			} )
		;
		
		return prompt.showModal();
	}
	/**
	 * 短暂提示
	 * 
	 * @param message 需提示的信息
	 * @param delay   显示时间(默认:1.5秒)
	 * @call L.tips( message [ , delay ] );
	 */
	,tips: function( message , delay ) {
		
		if( javask.object.isUndefined( message ) || javask.string.blank( message ) ) {
			return null;
		}
		
		var tips = dialog( {
				 id     : "L.TipsDialog"
				,zIndex : 3100
				,title  : false
				,content: message
				,padding: "20px 40px"
			} ),
			timer;

		// 设置定时器,定时关闭
		tips.addEventListener( "show" , function() {
			
			timer = window.setTimeout( function() {
				
				tips.close();
			} , ( delay || 1.5 ) * 1000 );
		} );
		
		return tips.show();
	}
	/**
	 * 加载提示框
	 * 
	 * @param message 需提示的信息
	 * @param animate 是否需要动画显示
	 * @call L.loading( message , animate );
	 */
	,loading: function( message , animate ) {
		
		if( typeof message == "boolean" ) {
			animate = message;
			message = "Please waiting";
		}else {
			message = message || "Please waiting";
			animate = animate || false;
		}
		
		var  dotLength    = 6
			,delay        = 0.25
			,noAnimateExt = "..."
			,loading      = dialog( {
				 id     : "L.LoadingDialog"
				,zIndex : 32000
				,title  : false
				,content: message
				,padding: "20px 40px"
			} )
			,getInitWaitingDot
			,timer
			,i            = 0
			,tempdot
		;
		
		// 根据点的个数,动态添加
		getInitWaitingDot = function() {
			
			var waitingDot = [];
			
			for( var index = 0; index < dotLength; index++ ) {
				waitingDot.push( '<span style="color:#fff;">.</span>' );
			}
			
			return waitingDot;
		};
		
		animate ? loading.content( message + getInitWaitingDot().join( "" ) ) : loading.content( message + noAnimateExt );
		
		// 绑定 onshow 事件
		i = 0;
		tempdot = getInitWaitingDot();
		loading.addEventListener( "show" , function() {
			
			// 如果不需要动画,直接返回
			if( !animate ) {
				return;
			}
			
			timer = window.setInterval( function() {
				
				// 当 i 达到 dotLength 时,重置
				if( i == dotLength ) {
					i = 0;
					tempdot = getInitWaitingDot();
				}
				
				tempdot[ i ] = '.';
				
				// L.log( tempdot );
				
				loading.content( message + tempdot.join( "" ) );
				
				++i;
			} , delay * 1000 );
		} );
		
		return loading.showModal();
	}
	/**********************************************************************************************************/
	/**
	 * 解决 jQuery 双击事件(dblclick)时,触发单击事件(click)的问题
	 * 
	 * @param handler  需要绑定事件的对象
	 * @param click    单击事件
	 * @param dblclick 双击事件
	 * @call L.bindClickAndDblclick( handler , click , dblclick );
	 */
	,bindClickAndDblclick: function( handler , click , dblclick ) {
		
		// 如果 handler 长度为零,直接返回
		if( handler.length < 1 ) {
			
			return handler;
		}
		
		var timer;
		
		handler.on( "click" , function( event ) {
			
			// 取消上次延时未执行的方法
			clearTimeout( timer );
		    // 执行延时
		    timer = setTimeout( function() {
		    	
		    	click( event );
		    
		    // 从测试结果来看,如果前后两次点击的时间在 300ms 左右的时候
		    // 还是很容易出现 click 和 dblclick 事件被"同时"调用的情况
		    // 而如果间隔的时间更短或更长，则只会有 click 或 dblclick 事件。
		    } , 300 );
		} )
		// 双击,清空
		&& handler.on( "dblclick" , function( event ) {
			
			// 取消上次延时未执行的方法
			clearTimeout( timer );
			
			dblclick( event );
		} );
		
		return handler;
	}
	/**
	 * 数字字符串截取,长度不够的在前面添加 "0"
	 * 
	 * @param text   需处理的字符串
	 * @param length 保留的位数
	 * @return String 处理后的字符串
	 * @call L.pattern( text , length );
	 */
	,pattern: function( text , length ) {
		
		// 如果 text 为空,或 length < 1,直接返回空字符串
		if( text == null || javask.object.isUndefined( text ) || length < 1 ) {
			return text;
		}
		
		// 将 text 强制转换为字符串
		text += "";
		// 如果 text 为空字符串,直接返回
		if( javask.string.empty( text ) ) {
			return text;
		}
		
		// 长度默认为 2 位
		length = length || 2;
		
		var index = 0 , pattern = "";
		
		// 预置 50 个 "0"
		pattern = "00000000000000000000000000000000000000000000000000";
		
		// 如果 length > 50,再继续循环添加
		// 循环添加 "0"
		if( length > 50 ) {
			for( index = 0 , len = length - 50; index < len; index++ ) {
				pattern += "0";
			}
		}
		
		text = pattern + text;
		
		// IE6和IE8下,substr不支持负数
		if( javask.browser.ua.isIe6 || javask.browser.ua.isIe8 ) {
			var len = text.length;
			text = text.substr( len - length , length );
		}else {
			text = text.substr( -length );
		}
		
		return text;
	}
	/**
	 * 格式化时间
	 * 
	 * @param date    Date对象
	 * @param pattern 时间格式化字符串
	 * @return String 当前时间字符串
	 * @call L.formatDate( new Date() , "yyyy-MM-dd HH:mm:ss" );
	 */
	,formatDate: function( date , pattern ) {
		
		// 如果 date 不是 Date 对象,或为空,则直接返回空字符串
		if( !( date instanceof Date ) || date == null || javask.object.isUndefined( date ) ) {
			return "";
		}
		
		// pattern 默认为完整时间格式
		pattern = pattern || L.config.SYSTEM_DATE_PATTERN_DATETIME;
		
		var  year      = date.getFullYear()       // 年
			,month     = date.getMonth() + 1      // 月
			,day       = date.getDate()           // 日
			,weekDay   = date.getDay()            // 周中的某一天
			,hour      = date.getHours()          // 时
			,minute    = date.getMinutes()        // 分
			,second    = date.getSeconds()        // 秒
			,minsecond = date.getMilliseconds()   // 秒
			,week      = [ "日" , "一" , "二" , "三" , "四" , "五" , "六" ]
			,time      = {
				 "yyyy": year                         // 年,4位
				,"yy"  : ( year + "" ).substr( -2 )   // 年,2位
				,"M"   : month                        // 月
				,"MM"  : L.pattern( month )           // 月,补 0
				,"d"   : day                          // 日
				,"dd"  : L.pattern( day )             // 日,补 0
				,"hh"  : hour
				,"HH"  : L.pattern( hour )            // 时,补 0
				,"m"   : minute                       // 分
				,"mm"  : L.pattern( minute )          // 分,补 0
				,"s"   : second                       // 秒
				,"ss"  : L.pattern( second )          // 秒,补 0
				,"S"   : minsecond                    // 毫秒
				,"SSS" : L.pattern( minsecond , 3 )   // 毫秒,补 0
				,"ww"  : weekDay                      // 周中的某一天
				,"WW"  : week[ weekDay ]              // 周中的某一天(大写)
			};
			
		
		// 替换时间
		pattern = pattern.replace( /([a-z])(\1)*/ig , function( name ) {
			
			return time[ name ];
		} );
		
		return pattern;
	}
	
	/**
	 * 获取系统当前完整时间<br/>
	 * 格式: yyyy-MM-dd HH:mm:ss
	 * 
	 * @return String 系统当前完整时间字符串
	 * @call L.getSystemDateTime();
	 */
	,getSystemDateTime: function() {
			
		return L.formatDate( new Date() );
	}
	
	/**
	 * 获取系统当前日期<br/>
	 * 格式: yyyy年MM月dd日&nbsp;星期WW
	 * 
	 * @return String 系统当前日期字符串
	 * @call L.getSystemDate();
	 */
	,getSystemDate: function() {
		
		return L.formatDate( new Date() , "yyyy年MM月dd日&nbsp;星期WW" );
	}
} );


// 设置 ajax 请求默认设置
$.ajaxSetup( {
	
	// 是否缓存数据
	cache: !L.config.developer
	// 仅在服务器数据改变时获取新数据
	// ifModified: !YZY.developer
} );
