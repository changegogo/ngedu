/**
 * question bank route.
 *
 * @file    questionBankRoute
 * @author  lengchao
 * @version
 * @date    2016-07-08
 */

"use strict";

var Tools = require( "../library/Tools" );

var QuestionBankModel = require( "../model/QuestionBank" );
var QuestionBankOptionModel = require( "../model/QuestionBankOption" );

var ChapterModel = require( "../model/Chapter" );
var SectionModel = require( "../model/Section" );
var DeviceModel = require( "../model/Device" );
var PostModel = require( "../model/Post" );
var BusinessModel = require( "../model/Business" );

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

/**
 * create or update question bank data.
 *
 * @param request
 * @param response
 */
exports.saveOrUpdate = function( request , response ) {

    var _q = {};
    var questionBankId = request.body[ "id" ];
    var questionBank = request.body;


    var questionPromise  = ( !questionBankId || questionBankId == "" )
                        ?QuestionBankModel.create( questionBank )
                        :QuestionBankModel.update(questionBank, {where:{id:questionBankId}} )
                            .then(function(rtn){
                                return QuestionBankModel.findById(questionBankId);
                            })
                            .then(function(q){
                                _q = q
                                return q.setBusinesses([]);
                            })
                            .then(function(rtn){ return _q.setOptions([]); })
                            .then(function(rtn){ return _q.setPost(null); })
                            .then(function(rtn){ return _q.setDevice(null); })
                            .then(function(rtn){ return _q})

    questionPromise
        .then( function( data ) {

            // chapter
            DeviceModel.findById( questionBank.device.id )
                .then( function( device ) {
                    device.addQuestionBank( data );
                } )
                // post
                .then( function() {
                    return PostModel.findById( questionBank.post.id );
                } )
                .then( function( post ) {
                    post.addQuestionBank( data );
                } )
                // bussiness
                .then( function() {
                    var businessesIds = [];
                    questionBank.businesses.forEach( function( business ) {

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
                // options
                .then( function() {
                    // batch save
                    //return QuestionBankOptionModel.bulkCreate( questionBank.options );
                    questionBank.options.forEach( function( option ) {
                        if(option.id) {delete option.id;}
                        data.createOption( option );
                    } );
                } )
                // return
                .then( function( data ) {

                    response.send( data );
                } )
            ;
        } )
        .catch(function(err){
            errResponse(err,request,response);
        });
};

/**
 * find all list of question bank.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    QuestionBankModel
        .findAll( {
             "order": [
                [ "created_at" , "desc" ]
            ]
            ,"include": [
                 {"model": DeviceModel}
                ,{"model": PostModel}
                ,{"model": BusinessModel}
            ]
        } )
        .then( function( questionBankList ) {

            response.send( questionBankList );
        } )
    ;
};

/**
 * find one model by id.
 *
 * @param request
 * @param response
 */
exports.get = function( request , response ) {

    var questionBankId = request.params.id;

    // do query
    QuestionBankModel
        .findOne( {
            "include": [DeviceModel, PostModel, BusinessModel, {model:QuestionBankOptionModel, as:"options"}]
            ,"where": {
                "id": questionBankId
            }
        } )
        .then( function( questionBank ) {
            response.send( questionBank );
        } )
        .catch(function(err){
            errResponse(err, request, response);
        });
    ;
};

exports.delete = function( req , res ) {

    var questionBankId = req.params.id;

    QuestionBankModel.destroy({where:{id:questionBankId}})
        .then(function(num){
            if(num > 0)
                {msgResponse(req, res, '成功删除' + num +'条记录');}
            else{
                throw new Error('需要删除的记录不存在');
            }
        })
        .catch(function(err){
            errResponse(err, req, res);
        })
};