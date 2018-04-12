/**
 * 滚动播放插件
 * 暂时只支持单个滚动
 * 
 * 
 * @fileoverview Carousel.js
 * @author Javask
 * @version 3.0
 */

$.fn.extend( {
	/**
	 * 只允许一个对象
	 */
	carousel: function( opt ) {
		
		// 只允许一个对象,如果长度不为1,直接
		if( this.length != 1 ) {
			return;
		}
		
		var _this = this,
			picSize = 0,
			picNumber = 0,
			size , left , top,
			width , height,
			picList , titleList , navList,
			carouselInter;
		
		// 默认配置
		opt = $.extend( {
			listElementName : "li",                   // 图片列表元素名称
			title           : $( ".pictitle" ),       // 图片标题jQuery对象
			titleElementName: "a",                    // 图片标题列表元素名称
			nav             : $( ".picnav" ),         // 图片按钮
			navElementName  : "a",                    // 图片按钮列表元素名称
			prev            : this.find( ".prev" ),   // 向前翻页按钮
			next            : this.find( ".next" ),   // 向后翻页按钮
			_this           : _this,
			hoverClass      : "on",                   // nav的hover样式
			width           : 0,                      // 图像宽度,如为零,则默认获取picList.li的宽度
			height          : 0,                      // 图像高度,如为零,则默认获取picList.li的高度
			dir             : "left",                 // left , right , up , down; effect为slide时才起作用
			autoPlay        : true,                   // 是否自动轮播
			effectSpeed     : "fast",                 // 图片效果变换的速度
			speed           : 1,                      // 图片变换的时间间隔(单位:秒)
			effect          : "slide",                // slide , fade
			type            : "click",                // 图片切换的方式,click,mouseover,dblclick
			init            : javask.N,               // 轮播开始前需要执行的函数,只执行一遍,参数为此次传进来的配置参数
			before          : javask.N                // 每次轮播开始前需要执行的函数,循环执行
		} , opt || {} );
		
		// 只允许绑定 click , mouseover , dblclick 事件
		opt.type = ( opt.type == "click" || opt.type == "mouseover" || opt.type == "dblclick" ) ? opt.type : "click";
		// 将图片变换速度转换成毫秒
		opt.speed = opt.speed * 1000;
		
		// 取得图片列表
		picList = _this.find( opt.listElementName );
		// 
		picList.each( function( index , pic ) {
			
			// 将图片转换为 jQuery 对象
			pic = $( pic );
			
			// 获取图片尺寸
			opt.width = ( opt.width == 0 ? pic.outerWidth() : opt.width );
			opt.height = ( opt.height == 0 ? pic.outerHeight() : opt.height );
			
			/*if( opt.effect == "fade" ) {
				opt.picList.css( {
					"position": "relative"
				} );
				pic.css( {
					"position": "relative"
				} );
				if( i == 0 ) {
					pic.css( "top" , "0px" );
				}
				pic.hide();
			}*/
			
		} );
		
		// 轮播开始前执行的函数
		opt.before( opt );
		
		// 得到图片个数
		size = picList.length;
		
		// 如果图片数量为零,则直接退出
		if( size == 0 ) {
			return;
		}
		
		// 查找图片标题元素
		titleList = opt.title.find( opt.titleElementName );
		// 查找图片按钮元素
		navList = $( opt.nav.find( opt.navElementName )/*.toArray().reverse()*/ );
		navList.each( function( index , nav ) {
			$( nav ).data( "index" , index );
		} );
		
		// 在最外层包裹一个 div
		_this.wrap( javask.tag.div().css( {
			"width"   : _this.width() + "px",
			"height"  : _this.height() + "px",
			"overflow": "hidden"
		} ) );
		switch( opt.effect ) {
			
				// 图片变换模式为移动
				case "slide":
					switch( opt.dir ) {
						// 向左移动
						case "left":
							// picList.addClass( "l" );
							picList.css( "float" , "left" );
							
							width = opt.width;
							
							// 如果总体框架宽度与单个图片宽度不同
							if( opt.width != picList.outerWidth() ) {
							
								// 需要轮换的屏数为: 图片总宽度 / 总体框架宽度
								// 取整,有小数加1
								// 此时 size 为图片总数
								// 需要保证图片宽度不为零
								var allWidth = picList.outerWidth() * size,
									mod      = allWidth % opt.width;
								size = allWidth / opt.width;
								
								if( size == Infinity ) {
									size = 0;
								}
								// 转为整数
								size = parseInt( size );
								size = mod > 0 ? size + 1 : size;
							}
							
							_this.css( {
								"width": opt.width * size + "px"
							} );
							break;
						// 向右移动
						case "right":
							// picList.addClass( "r" );
							picList.css( "float" , "right" );
							_this.css( {
								"width"      : opt.width * size + "px",
								"margin-left": "-" + ( _this.width() - opt.width ) + "px"
							} );
							break;
						// 向上移动
						case "up":
							_this.css( {
								"height": opt.height * size + "px"
							} )
							break;
						// 向下移动
						/*case "down":
							opt.picList.css( {
								"height": opt.height * size + "px",
								"margin-top": "-" + ( opt.picList.height() - opt.height ) + "px"
							} );
							break;*/
					}
					break;
				case "fade":
					break;
			}
		
		//-----------------------------------------------------------------------
		function next( number ) {
			
			var nextNumber = ( number == ( size - 1 ) ? 0 : ( number + 1 ) );
			
			switch( opt.effect ) {
				// 图片变换模式为移动
				case "slide":
					switch( opt.dir ) {
						// 向左移动
						case "left":
							_this.animate( {
								"margin-left": "-" + opt.width * nextNumber + "px"
							} , opt.effectSpeed );
							break;
						// 向右移动
						case "right":
							_this.animate( {
								"margin-left": opt.width * ( nextNumber + 1 ) - _this.width() + "px"
							} , opt.effectSpeed );
							break;
						// 向上移动
						case "up":
							_this.animate( {
								"margin-top": "-" + opt.height * nextNumber + "px"
							} , opt.effectSpeed );
							break;
						// 向下移动
						/*case "down":
							opt.picList.animate( {
								"margin-top": opt.height * ( nextNumber + 1 ) - opt.picList.height() + "px"
							} , opt.effectSpeed );
							break;*/
					}
					break;
				case "fade":
					/*number = ( ( number == -1 ) ? ( size - 1 ) : number );
					$( pics.get( number ) ).css( "top" , "0px" );
					$( pics.get( nextNumber ) ).css( "top" , "-" + opt.height + "px" );
					// alert($( pics.get( number ) ).css( "top" )+","+	$( pics.get( nextNumber ) ).css( "top" ));
					$( pics.get( number ) ).fadeOut( opt.effectSpeed , function() {
						// $( this ).css( "top" , "-" + opt.height + "px" );
						$( pics.get( nextNumber ) ).css( "top" , "0px" );
					} );
					$( pics.get( nextNumber ) ).fadeIn( opt.effectSpeed );*/
					break;
			}
			picNumber = nextNumber;
			$( titleList/*.eq( number )*/ ).hide();
			$( titleList.eq( nextNumber ) ).show();
			$( navList/*.eq( number )*/ ).removeClass( opt.hoverStyle );
			$( navList.eq( nextNumber ) ).addClass( opt.hoverStyle );
		}
		
		//-----------------------------------------------------------------------
		titleList.hide();
		next( -1 );
		
		// 自动轮播
		if( opt.autoPlay ) {
			carouselInter = setInterval( function() {
				next( picNumber );
			} , opt.speed );
		}
		
		// 鼠标移向图片时,停止动画
		_this.hover( function() {
			opt.autoPlay && clearInterval( carouselInter );
		} , function() {
			if( opt.autoPlay ) {
				carouselInter = setInterval( function() {
					next( picNumber );
				} , opt.speed );
			}
		} );
		
		// 上一个按钮事件
		opt.prev.click( function() {
			var pn = picNumber - 1;
			pn = pn < 0 ? size - 1 : pn;
			pn -= 1;
			// alert( pn );
			next( pn );
			opt.autoPlay && clearInterval( carouselInter );
			navList.eq( picNumber ).removeClass( opt.hoverStyle );
			// picNumber = li.data( "index" );
			// next( picNumber );
			if( opt.autoPlay ) {
				carouselInter = setInterval( function() {
					next( picNumber );
				} , opt.speed );
			}
		} );
		
		// 下一个按钮事件
		opt.next.click( function() {
			next( picNumber );
			opt.autoPlay && clearInterval( carouselInter );
			navList.eq( picNumber ).removeClass( opt.hoverStyle );
			// picNumber = li.data( "index" );
			// next( picNumber );
			if( opt.autoPlay ) {
				carouselInter = setInterval( function() {
					next( picNumber );
				} , opt.speed );
			}
		} );
		
		// 控制按钮事件绑定
		navList.each( function( index , nav ) {
			
			nav = $( nav );
			
			nav.bind( opt.type , function() {
				opt.autoPlay && clearInterval( carouselInter );
				navList.eq( picNumber ).removeClass( "hover" );
				picNumber = nav.data( "index" );
				next( picNumber - 1 );
				if( opt.autoPlay ) {
					carouselInter = setInterval( function() {
						next( picNumber );
					} , opt.speed );
				}
			} );
		} );
	}
} );
