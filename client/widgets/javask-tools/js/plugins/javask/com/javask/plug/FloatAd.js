/**
 * 图片漂浮
 * 
 * @fileoverview FloatAd.js
 * @author Javask
 * @version 3.0
 */

$.fn.extend( {
	/**
	 * 只允许一个对象
	 */
	floatAd: function( config ) {
		
		// 只允许一个对象,如果长度不为1或当前使用的浏览器为IE6,直接return
		// javask.browser.ua.isIe6
		if( this.length != 1 || javask.browser.ua.isIe6 ) {
			return;
		}
		
		var _this = this;
		
		// 默认配置
		config = $.extend( {
			container  : _this,                   // 漂浮广告容器
			defaultUnit: "px",                    // 默认单位
			width      : "",                      // 宽度
			height     : "",                      // 高度
			speed      : 10,                      // 移动速度
			increment  : 1,                       // 每次递增的长度
			zIndex     : 100,                     // z-index值，默认为auto
			defaultTop : 0,                       // 默认top值
			defaultLeft: 0,                       // 默认left值
			closeHandle: _this.find( ".close" )   // 关闭句柄
		} , config || {} );
		
		// 如果width,height任何一个为空，均直接退出
		if( javask.string.empty( config.width ) || javask.string.empty( config.height ) ) {
			// 移除容器
			config.container.remove();
			return;
		}
		
		var _window    = $( window ),               // window的jQuery对象
			_document  = $( document ),             // document的jQuery对象
			viewWidth  = _window.width(),           // 窗口可视区域宽度
			viewHeight = _window.height(),          // 窗口可视区域高度
			pause      = false,                     // container是否处于暂停状态
			doFloat    = $.noop,                    // 漂浮事件函数
			interval,
			topOn      = true,                      // true:右;false:左
			leftOn     = true;                      // true:下;false:上
		
		
		// 确保container的position值为fixed
		config.container.css( "position" ) != "fixed" && config.container.css( "position" , "fixed" );
		// 如果container的默认top和left值为auto，则设置其top和left值
		config.container.css( "top" ) == "auto" && config.container.css( "top" , config.defaultTop );
		config.container.css( "left" ) == "auto" && config.container.css( "left" , config.defaultLeft );
		
		// 定义漂浮事件函数
		doFloat = function() {
			var left       = config.container.css( "left" ),   // 取得container的left值
				top        = config.container.css( "top" ),    // 取得container的top值
				scrollLeft = _document.scrollLeft(),           // 滚动条距左侧位置
				scrollTop  = _document.scrollTop();            // 滚动条距顶部位置
			// left ==> 0px，需去除px
			left = javask.string.s2n( left , config.defaultUnit );
			top  = javask.string.s2n( top , config.defaultUnit );
			
			// 纵向
			top  = topOn ? top + config.increment : top - config.increment;
			// 如果top小于零，说明已到达最顶端
			if( top <= 0 ) {
				topOn = true;
				top   = 0;
			}
			// 如果top大于或等于viewHeight+height，说明已到达最底部
			if( top >= ( viewHeight - config.height ) ) {
				topOn = false;
				top   = viewHeight - config.height;
			}
			
			// 横向
			left = leftOn ? left + config.increment : left - config.increment;
			// 如果left小于或等于零，说明已到达最左侧
			if( left <= 0 ) {
				leftOn = true;
				left   = 0;
			}
			// 如果left大于或等于viewWidth+width，说明已到达最右侧
			if( left >= ( viewWidth - config.width ) ) {
				leftOn = false;
				left   = viewWidth - config.width;
			}
			
			// left += config.increment;
			// top  += config.increment;
			config.container.css( {
				"left": left,
				"top" : top
			} );
		};
		// 设定计时器
		interval = setInterval( doFloat , config.speed );
		
		/*
		 * 为关闭句柄添加关闭事件
		 * 直接移动container
		 */
		config.closeHandle.on( "click" , function( event ) {
			// 清除计时器
			clearInterval( interval );
			interval = null;
			// 将容器移除
			config.container.remove();
		} );
		
		// container暂停和恢复
		config.container.hover( function() {
			// 鼠标移入，暂停
			pause = true;
			clearInterval( interval );
			interval = null;
		} , function() {
			// 鼠标移出，恢复
			pause = false;
			interval = setInterval( doFloat , config.speed );
		} );
		
		// 滚动条滚动时的图片位置
		/*_window.on( "scroll" , function( e ) {
			// 清除计时器
			clearInterval( interval );
			interval = null;
			// 将容器移动到滚动条滚动后的相对位置
			var left       = config.container.css( "left" ),   // 取得container的left值
				top        = config.container.css( "top" ),    // 取得container的top值
				scrollLeft = _document.scrollLeft(),           // 滚动条距左侧位置
				scrollTop  = _document.scrollTop();            // 滚动条距顶部位置
			// left ==> 0px，需去除px
			left = javask.string.s2n( left , config.defaultUnit );
			top  = javask.string.s2n( top , config.defaultUnit );
			left += scrollLeft;
			top  += scrollTop;
			config.container.css( {
				"left": left,
				"top" : top
			} );
			// 重新开启计时器
			interval = setInterval( doFloat , config.speed );
		} );*/
		
	}
} );
