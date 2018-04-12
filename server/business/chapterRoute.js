/**
 * routers for chapter.
 *
 * @file    chapterRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var ChapterModel = require( "../model/Chapter" );

/**
 * find all list of chapter.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    ChapterModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "number" , "asc" ]
            ]
        } )
        .then( function( chapterList ) {

            response.send( chapterList );
        } )
    ;
};

/**
 * create or update chapter data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var chapterId = request.body[ "id" ];
    var chapter = request.body;

    ( !chapterId || chapterId === "" )
        // create
        ? ( function() {

        ChapterModel
            .create( chapter )
            .then( function( data ) {

                response.send( data );
            } )
        ;
    } )()
        // update
        : ( function() {

        ChapterModel
            .findById( chapterId )
            .then( function( _chapter ) {

                !!_chapter && _chapter.update( chapter ).then( function( data ) {

                    response.send( data );
                } )
            } )
        ;
    } )()
    ;
};

/**
 * find a model by id.
 *
 * @param request
 * @param response
 */
exports.get = function( request , response ) {

    var chapterId = request.params.id;

    // do query
    ChapterModel
        .findById( chapterId )
        .then( function( chapter ) {

            response.send( chapter );
        } )
    ;
};
