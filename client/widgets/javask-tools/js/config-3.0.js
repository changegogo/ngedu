/**
 * Javask javascript tools
 * 配置文件
 * 
 * @fileoverview config.js
 * @author Javask
 * @version 3.0
 */

$.extend( javask.config , {
	debug   : true,
	domain  : "",
	rootPath: "",
	libPath : "",
	skinPath: "",
	skin    : "default"
} );

/*--------------------------------------------------------------------------*/
/**
 * 加载导入类
 */
( function() {
	var js         = $( "script" ),
		urlVersion = "engine-" + javask.version + ".js",
		engine,
		enginePath = "";
	js.each( function( index , script ) {
		script = $( script );
		var enginePathLength = 0;
		if( !javask.object.isUndefined( script.attr( "src" ) ) && javask.string.include( script.attr( "src" ) , urlVersion ) ) {
			engine           = script;
			enginePath       = script.attr( "src" ).replace( urlVersion , "" );
			enginePathLength = enginePath.length;
			// 去除 /js/
			enginePath       = enginePath.substring( 0 , enginePathLength - 4 );
			// alert( enginePath );
		}
	} );
	if( !javask.object.isUndefined( engine ) ) {
		var text = javask.string.trim( engine.html() ),
		// var text    = javask.string.trim( engine.text() ),
			pattern = /\s*import\s+([a-zA-Z0-9\.]+)/g,
			m       = text.replace( pattern , "$1" ).split( ";" ),
			path , id;
		
		// 删除数据最后一个元素
		m.pop();
		// 遍历加载
		$.each( m , function( index , value ) {
			path = "/js/plugins/javask/" + value.replace( /\./g , "/" ) + ( javask.config.debug ? "" : ".min" ) + ".js";
			id = "JavaskJSTools_Import_" + value.replace( /\./g , "_" );
			// alert( "path: " + $.javask.config.libPath + path );
			javask._import( "js" , enginePath + path , id );
		} );
		// 加载UI皮肤
		javask._import( "css" , enginePath + "/theme/" + ( javask.string.blank( javask.config.skin ) ? "default" : javask.config.skin ) + "/css/ui.css" , "JAVASK_UI_SKIN_CSS" );
	}
} )();
