/**
 * section model.
 *
 * @file    Section.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Section = sequelize.define(
     "section"
    ,{
         "number": {
             "type"        : Sequelize.INTEGER
            ,"defaultValue": 0
            ,"field"       : "sortnumber"
        }
        ,"name": {
             "type" : Sequelize.STRING(200)
            ,"field": "section_name"
        }
        ,"remark": {
             "type" : Sequelize.STRING(2000)
            ,"field":"remark"
        }
    }
    ,{
        "tableName": prefix + "section"
    }
);

module.exports = Section;
