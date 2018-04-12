/**
 * routers for course.
 *
 * @file    courseRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var encrypt = require( "../library/Encrypt" );

var CourseModel = require( "../model/Course" );
var ChapterModel = require( "../model/Chapter" );
var SectionModel = require( "../model/Section" );
var DeviceModel = require( "../model/Device" );
var PostModel = require( "../model/Post" );
var RepresentationModel = require( "../model/Representation" );
var BusinessModel = require( "../model/Business" );
var CourseBusiness = require("../model/CourseBusiness");

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;
/**
 * find all list of course.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    CourseModel
        .findAll( {
            "order": [
                [ "id" , "asc" ]
            ]
            ,"include": [
                {
                     "all": true
                    //,"nested": true
                }
            ]
        } )
        .then( function( courseList ) {
            response.send( courseList );
        } )
        .catch(function(err){
            response.send({success: false, msg:response.message});
        })
    ;
};

/**
 * find all list of course by device.
 *
 * @param request
 * @param response
 */
exports.getAllListByDevice = function( request , response ) {

    var deviceId = request.params.id;

    /*DeviceModel.findById( deviceId ).then( function( device ) {

        return device.getCourses();
    } ).then( function( courses ) {

        response.send( courses );
    } );*/

    CourseModel
        .findAll( {
            "where": {
                "device_id": deviceId
            }
            ,"order": [
                [ "id" , "asc" ]
            ]
            ,"include": [
                //{
                //     "model": DeviceModel
                //    ,"where" : {
                //        "id": deviceId
                //    }
                //}
                {
                     "all": true
                    //,"nested": true
                }
            ]
        } )
        .then( function( courseList ) {

            response.send( courseList );
        } )
    ;
};
/**
 * find new list of course by device.
 *
 * @param request
 * @param response
 */
exports.getNewListByDevice = function( request , response ) {

    var deviceId = request.params.id;

    CourseModel
        .findAll( {
            "order": [
                [ "created_at" , "desc" ]
            ]
            ,"include": [
                {
                    "model": DeviceModel
                    ,"where": {
                        "id": deviceId
                    }
                }
                ,{"model": PostModel}
                ,{"model": BusinessModel}
                ,{"model": RepresentationModel}
            ]
            ,"limit":4

        } )
        .then( function( courseList ) {

            // courseList.forEach( function( course ) {

            //     course.reviewImage = encrypt.encrypt( course.reviewImage ).toUpperCase();
            // } );

            response.send( courseList );
        } )
    ;
};

/**
 * find all list of course by post.
 *
 * @param request
 * @param response
 */
exports.getAllListByPost = function( request , response ) {

    var postId = request.params.id;

    CourseModel
        .findAll( {
            "order": [
                [ "id" , "asc" ]
            ]
            ,"include": [
                 {"model": DeviceModel}
                ,{"model": ChapterModel}
                ,{"model": SectionModel}
                ,{
                     "model": PostModel
                    ,"where": {
                        "id": postId
                    }
                }
                ,{"model": BusinessModel}
                ,{"model": RepresentationModel}
            ]
        } )
        .then( function( courseList ) {

            response.send( courseList );
        } )
    ;
};
/**
 * find new list of course by post.
 *
 * @param request
 * @param response
 */
exports.getNewListByPost = function( request , response ) {

    var postId = request.params.id;

    CourseModel
        .findAll( {
            "order": [
                [ "created_at" , "desc" ]
            ]
            ,"include": [
                 {"model": DeviceModel}
                ,{
                    "model": PostModel
                    ,"where": {
                        "id": postId
                    }
                }
                ,{"model": BusinessModel}
                ,{"model": RepresentationModel}
            ]
            ,limit:4
        } )
        .then( function( courseList ) {

            // courseList.forEach( function( course ) {

            //     course.reviewImage = encrypt.encrypt( course.reviewImage ).toUpperCase();
            // } );

            response.send( courseList );
        } )
    ;
};

/**
 * find all list of course by business.
 *
 * @param request
 * @param response
 */
exports.getAllListByBusiness = function( request , response ) {

    var businessId = request.params.id;

    CourseModel
        .findAll( {
            "order": [
                [ "id" , "asc" ]
            ]
            ,"include": [
                 {"model": DeviceModel}
                ,{"model": PostModel}
                ,{
                     "model": BusinessModel,
                     "where": {
                        "id": businessId
                     }
                }
                ,{"model": RepresentationModel}
            ]
        } )
        .then( function( courseList ) {

            response.send( courseList );
        } )
    ;
};
/**
 * find new list of course by business.
 *
 * @param request
 * @param response
 */
exports.getNewListByBusiness = function( request , response ) {

    var businessId = request.params.id;

    CourseModel
        .findAll( {
            "order": [
                [ "created_at" , "desc" ]
            ]
            ,"include": [
                 {"model": DeviceModel}
                ,{"model": PostModel}
                ,{
                     model: BusinessModel,
                    through:{
                        where:{
                            "business_id":businessId
                        }
                    },
                    required:true
                }
                ,{"model": RepresentationModel}
            ]
            ,"limit":4
        } )
        .then( function( courseList ) {

            // courseList.forEach( function( course ) {

            //     course.reviewImage = encrypt.encrypt( course.reviewImage ).toUpperCase();
            // } );

            response.send( courseList );
        } )
    ;
};

/**
 * course search.
 *
 * @param request
 * @param response
 */
exports.search = function( request , response ) {

    var  options             = {}
        // where
        ,chapterId           = request.query.chapterId
        ,sectionId           = request.query.sectionId
        ,courseName          = request.query.courseName
        ,representationId    = request.query.representationId
        ,deviceId            = request.query.deviceId
        ,postId              = request.query.postId
        ,businessIds         = request.query.businessIds
        ,businessId         = request.query.businessId
        ,lecturer            = request.query.lecturer
        ,where               = {}
        // sort
        ,sort                = request.query.sort
        ,order               = []
        // include model
        ,include             = []
        ,chapterModel        = {"model": ChapterModel}
        ,sectionModel        = {"model": SectionModel}
        ,representationModel = {"model": RepresentationModel}
        ,deviceModel         = {"model": DeviceModel}
        ,postModel           = {"model": PostModel}
        ,businessModel       = {"model": BusinessModel}
    ;

    /*
     * query condition
     */
    // chapter
    if( !!chapterId ) {
        chapterModel.where = {
            "id": chapterId
        };
    }
    include.push( chapterModel );
    // section
    if( !!sectionId ) {
        sectionModel.where = {
            "id": sectionId
        };
    }
    include.push( sectionModel );
    // representation
    if( !!representationId ) {
        representationModel.where = {
            "id": representationId
        };
    }
    include.push( representationModel );
    // device
    if( !!deviceId ) {
        deviceModel.where = {
            "id": deviceId
        };
    }
    include.push( deviceModel );
    // post
    if( !!postId ) {
        postModel.where = {
            "id": postId
        };
    }
    include.push( postModel );
    // business
    if( !!businessIds || businessId ) {
        businessIds = businessId ? [businessId] : businessIds.split( "," );
        businessModel.where = {
            "id": {
                "$in": businessIds
            }
        };
    }
    include.push( businessModel );
    // course
    if( !!courseName ) {
        where[ "course_name" ] = {
            "$like": "%" + courseName + "%"
        };
    }
    if( !!lecturer ) {
        where[ "lecturer" ] = {
            "$like": "%" + lecturer + "%"
        };
    }

    /*
     * order by
     */
    switch( sort ) {
        case "hour_asc"      : order.push( [ "hour" , "asc" ] );                      break;
        case "hour_desc"     : order.push( [ "hour" , "desc" ] );                     break;
        case "device"        : order.push( [ DeviceModel , "id" , "desc" ] );         break;
        case "post"          : order.push( [ PostModel , "id" , "desc" ] );           break;
        case "representation": order.push( [ RepresentationModel , "id" , "desc" ] ); break;
    }

    if( Object.keys( where ).length > 0 ) {
        options.where = where;
    }
    options.order = order;
    options.include = include;

    console.log( options );

    CourseModel.findAll( options ).then( function( courseList ) {

        response.send( courseList );
    } );
};

/**
 * create or update course data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var courseId = request.body[ "id" ];
    var course = request.body;

    var _c = {}; //courseInstance;


    var coursePromise = ( !courseId || courseId == "" )
                            ? CourseModel.create( course )
                            : CourseModel.update(course,{where:{id:courseId}})
                                .then(function(){
                                    return CourseModel.findById(courseId);
                                })
                                .then(function(courseInstance){
                                    _c = courseInstance;
                                    return _c.setDevice(null);
                                })
                                .then(function(){
                                    return _c.setPost(null);
                                })
                                .then(function(){
                                    return _c.setRepresentation(null);
                                })
                                .then(function(){
                                    return _c.setBusinesses([]);
                                })
                                .then(function(){
                                    return _c;
                                });
    coursePromise.then(function(data){

        DeviceModel.findById( course.device.id )
            .then( function( device ) {
                device.addCourse( data );
            } )
            // post
            .then( function() {
                return PostModel.findById( course.post.id );
            } )
            .then( function( post ) {
                post.addCourse( data );
            } )
            // representation
            .then( function() {
                return RepresentationModel.findById( course.representation.id );
            } )
            .then( function( representation ) {
                representation.addCourse( data );
            } )
            // bussiness
            .then( function() {
                var businessesIds = [];
                course.businesses.forEach( function( business ) {
                    businessesIds.push( business.id );
                } );

                return BusinessModel.findAll( {
                    "where": {
                        "id": {
                            "in": businessesIds
                        }
                    }
                } );
            } )
            .then( function( businesses ) {
                data.addBusinesses( businesses );
            } )
            // return
            .then( function( data ) {

                response.send( data );
            } )
        ;
    })
    .catch(function(err){
        errResponse(err, request, response);
    })



};

/**
 * find one model by id.
 *
 * @param request
 * @param response
 */
exports.get = function( request , response ) {

    var courseId = request.params.id;

    // do query
    CourseModel
        .findOne( {
            "include": [
                 {"model": DeviceModel}
                ,{"model": ChapterModel}
                ,{"model": SectionModel}
                ,{"model": PostModel}
                ,{"model": BusinessModel}
                ,{"model": RepresentationModel}
            ]
            ,"where": {
                "id": courseId
            }
        } )
        .then( function( course ) {
            response.send( course );
        } )
    ;
};


// get all courses info
exports.getAllCourses = function(req, res){
    CourseModel.findAll({
        include:[DeviceModel, PostModel, BusinessModel]
    }).then(function(courses){
        res.send(CourseModel.planCourses(courses));
    }).catch(function(err){
        res.send({success:false, err:err.message});
    })
};


exports.deleteById = function(req, res){
    CourseModel.destroy({where:{id:req.params.id}})
        .then(function(num){
            if(num > 0)
                {msgResponse(req, res, '成功删除' + num +'个课程');}
            else{
                throw new Error('需要删除的课程不存在');
            }
        })
        .catch(function(err){
            errResponse(err, req, res);
        })
}


exports.lastThreeMP4Courses = function(req, res){
    CourseModel.findAll({
        include:[{
            model:RepresentationModel,
            where:{
                name:'mp4'
                }
        }],
        order:'created_at desc',
        limit:3,
    })
    .then(function(courses){
        res.send(courses);
    })
    .catch(function(err){
        errResponse(err, req, res);
    });
};


exports.getPlayedMostByQuery = function(req, res){
    var options = {
            where:[],
            include:[]
        };
    if(req.query.deviceId){
        options.where.push({device_id:req.query.deviceId})
    };
    if(req.query.postId)
    {
        options.where.push({post_id:req.query.postId})
    }
    if(req.query.businessId)
    {
        // options.where.push({business_id:req.query.businessId})

        options.include.push({
                     model: BusinessModel,
                     through:{
                         where: {
                            'business_id': req.query.businessId
                         }
                     },
                     required:true,
        });
    }
    options.order = [["played_count","desc"]];
    options.limit = 4;
    console.log(options)
    CourseModel.findAll(options)
        .then(function(courses){
            res.send(courses)
        })
        .catch(function(err){
            errResponse(err, req, res);
        })
};