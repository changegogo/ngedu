/**
 * image route.
 *
 * @file    image.js
 * @author  lengchao
 * @version
 * @date    2016-05-23
 */

"use strict";

var express = require( "express" );
var app = express();
var imageRoute = require( "../business/imageRoute" );

// test
app.get( "/thumbnail/:path/:width/:height" , imageRoute.thumbnail );

module.exports = app;