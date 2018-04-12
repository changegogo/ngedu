/**
 * routers for section.
 *
 * @file    sectionRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var SectionModel = require( "../model/Section" );

/**
 * find all list of section.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    SectionModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "number" , "asc" ]
            ]
        } )
        .then( function( sectionList ) {

            response.send( sectionList );
        } )
    ;
};

/**
 * create or update section data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var sectionId = request.body[ "id" ];
    var section = request.body;

    ( !sectionId || sectionId === "" )
        // create
        ? ( function() {

        SectionModel
            .create( section )
            .then( function( data ) {

                response.send( data );
            } )
        ;
    } )()
        // update
        : ( function() {

        SectionModel
            .findById( sectionId )
            .then( function( _section ) {

                !!_section && _section.update( section ).then( function( data ) {

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

    var sectionId = request.params.id;

    // do query
    SectionModel
        .findById( sectionId )
        .then( function( section ) {

            response.send( section );
        } )
    ;
};
