/**
 * upload about.
 *
 * @file    uploadRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-18
 */

var multer = require( "multer" );
var encrypt = require( "../library/Encrypt" );
var moment = require( "moment" );
var fs = require( "fs" );
var mkdirp = require( "mkdirp" );
var _ = require('lodash');
var path = require('path');
var config = require('../config')
 
var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

var AdmZip = require('adm-zip');

const md5File = require('md5-file');

var path = require('path');



/**
 * create directory
 *
 * @param dest need to create the directory.
 */
var createDirectory = function( dest ) {

    var exist = fs.existsSync( dest );
    if( exist ) {
        return;
    }

    // 递归创建目录
    mkdirp.sync( dest );
};

/**
 * get file path
 *
 * @param now
 * @param fileType
 * @returns {{dest: string, path: string}}
 */
var getFilePath = function( now , fileType ) {

    var destTpl = "/{fileType}/{yyyy}/{MM}/{dd}";
    var dest = destTpl.replace( /(\{fileType}|\{yyyy}|\{MM}|\{dd})+/g , function( character ) {

        switch( character ) {
            case "{fileType}": return fileType;
            case "{yyyy}"    : return now.format( "YYYY" );
            case "{MM}"      : return now.format( "MM" );
            case "{dd}"      : return now.format( "DD" );
        }
    } );
    //dest = process.cwd() + "/client/app/upload" + desc;

    var path = {
         "dest": process.cwd() + "/client/app/upload" + dest
        ,"path": "/upload" + dest
    };

    // create directory
    createDirectory( path.dest );

    return path;
}

/**
 * get file suffix.
 *
 * @param originalName
 * @returns {string}
 */
var getFileSuffix = function( originalName ) {

    if( originalName.indexOf( "." ) < 0 ) {

        return "";
    }

    originalName = originalName.split( "." );

    return "." + originalName[ 1 ];
};

/**
 * get file name
 *
 * @param now
 * @param originalName
 * @returns {string}
 */
var getFileName = function( now , originalName ) {

    // encrypt
    var timestamp = now.format( "x" );
    timestamp = encrypt.encrypt( timestamp );
    timestamp = timestamp.toUpperCase();

    // get suffix
    var suffix = getFileSuffix( originalName );

    var fileName = timestamp + suffix;

    return fileName;
};

var getStorage = function( fileType ) {

    var now = moment();
    var dest = getFilePath( now , fileType );

    return multer.diskStorage( {
        "destination": function( request , file , callback ) {

            callback( null , dest.dest );
        }
        ,"filename": function( request , file , callback ) {

            callback( null , getFileName( now , file.originalname ) );
        }
    } );
};

/**
 * error process.
 *
 * @param response
 */
var errorProcess = function( response ) {

    response.send( {
         "success": false
        ,"message": "Error uploading file."
    } );
}

/**
 * do upload.
 *
 * @param request
 * @param response
 * @param fileType file type.
 */
var upload = function( request , response , fileType ) {

    var upload = multer( {
        "storage": getStorage( fileType )
    } ).single( "uploadFile" );

    upload( request , response , function( error ) {

        !!error && errorProcess( response );

        var fileName = getFilePath( moment() , fileType ).path;
        fileName += "/";
        fileName += request.file.filename;

        response.send( {
             "success" : true
            ,"fileName": fileName
        } );
    } );
}

/**
 * upload courseware to server.
 *
 * @param request
 * @param response
 */
exports.courseUpload = function( request , response ) {

    var fileType = "video";
    upload( request , response , fileType );
};


exports.coursePdfUpload = function( req , res ) {
    var fileType = "pdf";
    upload( req , res , fileType );
};

exports.courseSwfUpload = function( req , res ) {

    var upload = multer({dest:config.path.upload.swf}).single("uploadFile");
    upload( req , res , function(err){
        if(err)
        {
            errorProcess( res );
        }
        else{

            var zip = new AdmZip(req.file.path);

            var zipEntries = zip.getEntries(); // an array of ZipEntry records

            var index = zip.getEntry('index.swf');

            var targetFile = "index.swf";

            var index_swf = _.find(zipEntries, function(entry){
                return entry.name === targetFile;
            });

            if(index_swf === null ){
                res.send({ "success" : false ,"msg": "压缩包格式不正确。" });
            }
            else{

                var stripIndexReg = new RegExp(targetFile);
                var stripPath = index_swf.entryName.replace(stripIndexReg, "");
                const hash = md5File.sync(req.file.path);

                try{
                    if(stripPath.length === 0)
                    {
                        zip.extractAllTo(path.join(config.path.upload.swf, hash),true);
                    }
                    else{
                        zip.extractEntryTo(
                            stripPath,
                            path.join(config.path.upload.swf, hash),
                            false,
                            true);
                    }

                }
                catch (e){
                    fs.unlinkSync(req.file.path);
                    res.send({ "success" : false ,"msg": "压缩包格式不对" })
                    return ;
                }

                fs.unlinkSync(req.file.path);
                res.send({"success" : true ,"fileName": hash })

            }
            
        }
    });
};

/**
 * upload thumbnail to server.
 *
 * @param request
 * @param response
 */
exports.thumbnailUpload = function( request , response ) {




    var fileType = "thumbnail";
    upload( request , response , fileType );
};



exports.uploadCarousel = function(req, res){
    if(req.files.carousel)
    {
        var filename = path.basename(req.files.carousel.path);
        res.send({success:true, filename:filename})
    }
    else{
        res.send({success:false, msg:'上传文件错误。'});
    }


};


exports.uploadNews = function(req, res){
    if(req.files.news)
    {
        var filename = path.basename(req.files.news.path);
        res.send({success:true, filename:filename})
    }
    else{
        res.send({success:false, msg:'上传文件错误。'});
    }


};

