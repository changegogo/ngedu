/**
 * routers for device.
 *
 * @file    device.js
 * @author  lengchao
 * @version
 * @date    2016-05-14
 */

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var DeviceModel = require( "../model/Device" );

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

/**
 * find all list of device.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    DeviceModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "sort" , "asc" ]
            ]
        } )
        .then( function( deviceList ) {

            response.send( deviceList );
        } )
    ;
};

/**
 * create or update device data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var deviceId = request.body[ "id" ];
    var device = request.body;



    ( !deviceId || deviceId === "" )
        // create
        ? ( function() {

            DeviceModel
                .create( device )
                .then( function( data ) {

                    response.send( data );
                } )
            ;
        } )()
        // update
        : ( function() {

            DeviceModel
                .findById( deviceId )
                .then( function( _device ) {

                    !!_device && _device.update( device ).then( function( data ) {

                        response.send( data );
                    } )
                } )
            ;
        } )()
    ;
};

/**
 * find one model by id.
 *
 * @param request
 * @param response
 */
exports.get = function( request , response ) {

    var deviceId = request.params.id;

    // do query
    DeviceModel
        .findById( deviceId )
        .then( function( device ) {
            response.send( device );
        } )
    ;
};

exports.deleteDevicesById = function(req, res){

    DeviceModel.destroy({where:{
        id:req.params.id
    }})
    .then(function(num){
        if(num === 0){throw new Error('没有找到需要删除的记录。')} 
        msgResponse(req, res, '删除设备成功。');
    })
    .catch(function(err){
        errResponse(err, req, res);
    })

};

exports.getAllDevicesName = function(req, res){

    DeviceModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "sort" , "asc" ]
            ]
        } )
        .then( function( deviceList ) {
            res.send( DeviceModel.planDevices(deviceList));
        } )
    ;
};