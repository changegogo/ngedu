/**
 * chapter model.
 *
 * @file    Chapter.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Chapter = sequelize.define(
     "chapter"
    ,{
         "number": {
             "type"        : Sequelize.INTEGER
            ,"defaultValue": 0
            ,"field"       : "sortnumber"
        }
        ,"name": {
             "type" : Sequelize.STRING(200)
            ,"field": "chapter_name"
        }
        ,"remark": {
             "type" : Sequelize.STRING(2000)
            ,"field":"remark"
        }
    }
    ,{
        "tableName": prefix + "chapter"
    }
);

module.exports = Chapter;
