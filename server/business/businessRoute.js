/**
 * routers for business.
 *
 * @file    businessRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var BusinessModel = require( "../model/Business" );

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

/**
 * find all list of business.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    BusinessModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "sort" , "asc" ]
            ]
        } )
        .then( function( businessList ) {

            response.send( businessList );
        } )
    ;
};

/**
 * create or update business data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var businessId = request.body[ "id" ];
    var business = request.body;

    ( !businessId || businessId === "" )
        // create
        ? ( function() {

        BusinessModel
            .create( business )
            .then( function( data ) {

                response.send( data );
            } )
        ;
    } )()
        // update
        : ( function() {

        BusinessModel
            .findById( businessId )
            .then( function( _business ) {

                !!_business && _business.update( business ).then( function( data ) {

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

    var businessId = request.params.id;

    // do query
    BusinessModel
        .findById( businessId )
        .then( function( business ) {

            response.send( business );
        } )
    ;
};

exports.deleteById = function(req, res){
    BusinessModel.destroy({where:{
        id:req.params.id
    }})
    .then(function(num){
        if(num === 1){msgResponse(req, res, '删除业务成功');}
        else{
            throw new Error('成功删除' + num +'个业务，出现异常');
        }
    })
    .catch(function(err){
        errResponse(err, req, res);
    })
}

exports.getAllBusinessesName = function(req, res){

    BusinessModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "sort" , "asc" ]
            ]
        } )
        .then( function( businessList ) {

            res.send( BusinessModel.planBusinesses(businessList) );
        } )
    ;
};