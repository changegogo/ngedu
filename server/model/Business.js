/**
 * business model.
 *
 * @file    Business.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Business = sequelize.define(
     "business"
    ,{
        "name": {
             "type" : Sequelize.STRING(200)
            ,"field": "business_name"
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
        "tableName": prefix + "business"
    }
);

module.exports = Business;

// should include Post 
Business.planBusinesses = function(businesses) {
  console.assert(Array.isArray(businesses), "输入必须是数组元素");
  return businesses.map(function(business) {
    return business.name;
  });

};