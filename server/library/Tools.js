/**
 * @file    Tools.js
 * @author  lengchao
 * @version 0.0.1
 * @date    2016-06-15
 */

"use strict";

/**
 * 打印对象下的所有属性
 *
 * @param originObject
 * @param separator
 */
exports.printProperties = function( originObject ) {

    var separator = arguments.length > 1 ? arguments[ 1 ] : "\n";

    var methods = [];

    for( var method in originObject ) {
        methods.push( method );
    }

    // sort
    methods.sort( function( a , b ) {
        return a - b;
    } );

    console.log( methods.join( separator ) );
};
