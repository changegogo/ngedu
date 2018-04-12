/**
 * representation model.
 *
 * @file    Representation.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Representation = sequelize.define(
     "representation"
    ,{
        "name": {
             "type" : Sequelize.STRING(200)
            ,"field": "representation_name"
        }
        ,"remark": {
             "type" : Sequelize.STRING(2000)
            ,"field":"remark"
        }
        ,"sort": {
             "type"        : Sequelize.INTEGER
            ,"defaultValue": 50000
            ,"field"       : "sortnumber"
        }
    }
    ,{
        "tableName": prefix + "representation"
    }
);

module.exports = Representation;
