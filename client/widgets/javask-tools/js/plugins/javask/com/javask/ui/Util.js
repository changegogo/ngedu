/**
 * com.javask.ui.Util
 * UI 工具类
 * 需要 jQuery.ua 插件支持
 * 
 * var util = javask.ui.util;
 * var size = util.getBackgroundSize();
 * var background = util.createBackgroundLayer( id );
 * var inner = util.createInnerLayer( width , height , id , "scroll" );
 * 
 * @fileoverview Util.js
 * @author Javask
 * @version 3.0
 */

jQuery.extend( javask.ui , {
	
	util: {
		
		/**
		 * 获取背景层尺寸
		 * @return object{width , height}
		 * @call javask.ui.util.getBackgroundSize();
		 */
		getBackgroundSize: function() {
			
			var _document    = jQuery( document ),
				_window      = jQuery( window ),
				pageWidth    = _document.width(),    // 文档宽度
				pageHeight   = _document.height(),   // 文档高度
				windowWidth  = _window.width(),      // 窗口宽度
				windowHeight = _window.height(),     // 窗口高度
				size = {
					width : 0,
					height: 0
				};
			
			if( pageWidth > windowWidth ) {
				if( javask.browser.ua.isIe && ( ( pageWidth - 20 ) == windowWidth || ( pageWidth - 21 ) == windowWidth ) ) {
					size.width = windowWidth;
				}else {
					size.width = pageWidth;
				}
			}else {
				size.width = windowWidth;
			}
			
			if( pageHeight > windowHeight ) {
				if( javask.browser.ua.isIe && ( ( pageHeight - 4 ) == windowHeight ) ) {
					size.height = windowHeight;
				}else {
					size.height = pageHeight;
				}
			}else {
				size.height = windowHeight;
			}
			
			return size;
		},
		
		/**
		 * 创建背景层
		 * 
		 * @param  id  需要创建的背景层的ID,必需
		 * @param  css 背景层样式,可选
		 * @return jQuery
		 * @call javask.ui.util.createBackgroundLayer( id );
		 */
		createBackgroundLayer: function( id , css ) {
			
			var size = javask.ui.util.getBackgroundSize();
			
			css = jQuery( css , {
				"background": "#000",
				"opacity"   : 0.1,
				"position"  : "absolute",
				"top"       : "0px",
				"left"      : "0px",
				"z-index"   : 9000,
				"width"     : size.width + "px",
				"height"    : size.height + "px"
			} );
			
			var background = javask.tag.div()
								.attr( "id" , id )
								.css( css );
			
			return background.hide();
		},
		
		/**
		 * 创建显示层
		 * 
		 * @param  id     显示区域的ID,必需
		 * @param  width  显示区域宽度,必需
		 * @param  height 显示区域高度,必需
		 * @param  scroll 是否使显示层始终保持在窗口中间,默认为false
		 * @return jQuery
		 * @call   javask.ui.util.createInnerLayer( , id width , height , scroll );
		 */
		createInnerLayer: function( id , width , height , css , scroll ) {
			
			scroll = scroll || false;
			
			css = jQuery( css , {
				"width"   : width + "px",
				"height"  : height + "px",
				"position": "absolute",
				"z-index" : 9001,
				"top"     : ( ( jQuery( window ).height() - height ) / 2 ) + jQuery( window ).scrollTop() + "px",
				"left"    : ( jQuery( window ).width() - width ) / 2 + "px"
			} );
			
			var inner = javask.tag.div()
							.attr( "id" , id )
							.css( css );
			
			if( scroll ) {
				
				// 兼容IE6
				if( javask.browser.ua.isIe6 ) {
					jQuery( window ).scroll( function() {
						inner.css( "top" , ( ( jQuery( window ).height() - height ) / 2 ) + jQuery( window ).scrollTop() + "px" );
					} );
				}else {
					inner.css( "position" , "fixed" );
				}
				
				
			}
			
			return inner.hide();
		}
	}
} );
