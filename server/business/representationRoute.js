/**
 * routers for representation.
 *
 * @file    representationRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-17
 */

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var RepresentationModel = require( "../model/Representation" );
var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

/**
 * find all list of representation.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    RepresentationModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "sort" , "asc" ]
            ]
        } )
        .then( function( representationList ) {

            response.send( representationList );
        } )
    ;
};

/**
 * create or update representation data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var representationId = request.body[ "id" ];
    var representation = request.body;

    ( !representationId || representationId === "" )
        // create
        ? ( function() {

            RepresentationModel
                .create( representation )
                .then( function( data ) {

                    response.send( data );
                } )
            ;
        } )()
            // update
            : ( function() {

            RepresentationModel
                .findById( representationId )
                .then( function( _representation ) {

                    !!_representation && _representation.update( representation ).then( function( data ) {

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

    var representationId = request.params.id;

    // do query
    RepresentationModel
        .findById( representationId )
        .then( function( representation ) {

            response.send( representation );
        } )
    ;
};


exports.deleteById = function(req, res){
    RepresentationModel.destroy({where:{
        id:req.params.id
    }})
    .then(function(num){
        if (num === 1)
        {
            msgResponse(req, res, '成功删除系统支持的文件类型。')
        }
        else{
            throw new Error('删除'+ num +'个文件类型，发生异常');
        }
    })
    .catch(function(err){
        errResponse(err, req, res);
    });
};