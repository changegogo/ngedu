/**
 * question bank options route.
 *
 * @file    questionBankOptionRoute.js
 * @author  lengchao
 * @version
 * @date    2016-07-15
 */

"use strict";

var QuestionBankOptionModel = require( "../model/QuestionBankOption" );

/**
 * craete or update a question bank option.
 *
 * @param request
 * @param response
 */
exports.saveOrUpdate = function( request , response ) {

    var optionId = request.body.id;
    var option = request.body;

    ( !optionId || optionId == "" )
        // create
        ? ( function() {

            QuestionBankOptionModel
                .create( option )
                .then( function( data ) {

                    response.send( data );
                } )
            ;
        } )()
        // update
        : ( function() {

        } )()
    ;
};
