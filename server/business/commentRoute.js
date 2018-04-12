/**
 * routes for comment.
 *
 * @file    commentRoute.js
 * @author  lengchao
 * @version
 * @date    2016-06-02
 */

"use strict";

var CommentModel = require( "../model/Comment" );
// associations
var CourseModel = require( "../model/Course" );
var AccountModel = require( "../model/Account" );

/**
 * find all list of comment by course id.
 *
 * @param request
 * @param response
 */
exports.getAllListByCourse = function( request , response ) {

    var courseId = request.params.courseId;

    CommentModel
        .findAll( {
            "order": [
                [ "created_at" , "desc" ]
            ]
            ,"include": [
                 {"model": AccountModel}
                ,{
                     "model": CourseModel
                    ,"where": {
                        "id": courseId
                    }
                }
            ]
        } )
        .then( function( commentList ) {

            response.send( commentList );
        } )
    ;
};

/**
 * create a comment into course.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var commentData = request.body;
    commentData.account = {};
    //commentData.account.id
    var accountId = request.session.accountId;

    if( !accountId ) {

        response.send( {
             "success": false
            ,"message": "请登录后进行评论！"
        } );
        return;
    }

    commentData.account.id = accountId;

    CommentModel
        .create( commentData )
        .then( function( comment ) {

            CourseModel.findById( commentData.course.id )
                .then( function( course ) {
                    course.addComment( comment );
                } )
                .then( function() {
                    return AccountModel.findById( commentData.account.id );
                } )
                .then( function( account ) {

                    return account.addComment( comment );
                } )
                .then( function() {

                    CommentModel.findOne( {
                        "where": {
                            "id": comment.id
                        }
                        ,"include": [
                             {"model": AccountModel}
                            ,{"model": CourseModel}
                        ]
                    } ).then( function( data ) {

                        response.send( {
                             "success": true
                            ,"message": "发表评论成功！"
                            ,"data"   : data
                        } );
                    } );
                } );
            ;
        } )
    ;
};
