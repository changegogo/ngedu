/**
 * image processing
 *
 * @file    imageRoute.js
 * @author  lengchao
* @version
* @date    2016-05-21
*/

var gm = require( "gm" );
var encrypt = require( "../library/Encrypt" );

/**
 * 获取并解密图片路径
 *
 * @param request
 * @returns {string}
 */
var getImagePath = function( request ) {

    var imagePath = request.params.path;
    if( !imagePath ) {
        return "";
    }

    // process image path
    try {
        imagePath = encrypt.decrypt( imagePath );
    }catch( e ) {
        return "";
    }
    imagePath = process.cwd() + "/client/app" + imagePath;

    return imagePath;
}

/**
 * calculate image point for crop.
 *
 * @param size oringe image size.
 * @param _size calculate image size.
 * @param data
 */
var calculateCropPosition = function( size , _size , data ) {

    var x = 0 , y = 0;
    // 黄金分割点
    var goldenRatio = 1 - 0.618;

    var sizeScale = size.width / size.height;
    var cropScale = data.width / data.height;

    switch( true ) {
        // 新图比原图要扁
        case sizeScale < cropScale:
            y = ( data._height - data.height ) * goldenRatio;
            y = Math.abs( y );
            _size.width = data.width;
            _size.height = data._height;
            _size.position.x = 0;
            _size.position.y = y;
            _size.crop = true;
            break;
        // 新图比原图要高
        case sizeScale > cropScale:
            x = ( data._width - data.width ) * goldenRatio;
            x = Math.abs( x );
            _size.width = data._width;
            _size.height = data.height;
            _size.position.x = x;
            _size.position.y = 0;
            _size.crop = true;
            break;
        // 新图和原图比例相同,直接缩放即可
        case sizeScale == cropScale:
            _size.crop = false;
            break;
    }
    _size.position.width = data.width;
    _size.position.height = data.height;

    return _size;
};
/**
 * calculate image size.
 *
 * @param request
 * @param size
 */
var calculateImageSize = function( request , size ) {

    var width = request.params.width;
    var height = request.params.height;

    var _width = size.width * height / size.height;
    var _height = width * size.height / size.width;

    var _size = {
         "width"   : 0
        ,"height"  : 0
        ,"type"    : ""
        ,"position": {
             "width" : 0
            ,"height": 0
            ,"x"     : 0
            ,"y"     : 0
        }
        ,"crop"    : false
    };

    switch( true ) {
        // only width
        case !!width && !height:
            _size.type = "only width";
            _size.width = width;
            _size.height = _height;
            break;
        // only height
        case !width && !!height:
            _size.type = "only height";
            _size.width = _width;
            _size.height = height;
            break;
        // both width and height
        case !!width && !!height:
            _size.type = "both width and height";
            // calculate image point for crop.
            _size = calculateCropPosition( size , _size , {
                 "width"  : width
                ,"height" : height
                ,"_width" : _width
                ,"_height": _height
            } );
            break;
        // both no width and height:
        // 直接输出原图
        case !width && !height:
            _size.type = "both no width and height";
            break;
    }

    return _size;
};

/**
 * 开始处理图像
 *
 * @param request
 * @param response
 * @param size
 * @param _gm
 */
var doProcessImage = function( request , response , size , _gm ) {

    var calculateResult = calculateImageSize( request , size );

    switch( calculateResult.type ) {
        case "only width":
        case "only height":
            _gm.resize( calculateResult.width , calculateResult.height , "!" );
            break;
        case "both width and height":
            _gm.resize( calculateResult.width , calculateResult.height , "!" );
            calculateResult.crop && _gm.crop( calculateResult.position.width , calculateResult.position.height , calculateResult.position.x , calculateResult.position.y );
            break;
        case "both no width and height":
            // 直接跳出,输出原图
            break;
    }

    // output
    _gm.stream( function( error , stdout/* , stderr*/ ) {

        stdout.pipe( response );
    } )
    ;
};

/**
 * thumbnail
 * @param request
 * @param response
 */
exports.thumbnail = function( request , response ) {

    var imagePath = getImagePath( request );
    if( imagePath == "" ) {
        response.send( {
            "message": "image path error!"
        } );
        return;
    }

    var _gm = gm( imagePath );

    _gm.size( function( error , size ) {

        if( !!error ) {

            response.send( error );
            return;
        }

        doProcessImage( request , response , size , _gm );
    } );
};
