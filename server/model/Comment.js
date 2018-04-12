/**
 * comment model.
 *
 * @file    Comment.js
 * @author  lengchao
 * @version
 * @date    2016-06-02
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Course = require( "./Course" );
var Account = require( "./Account" );

var Comment = sequelize.define(
     "comment"
    ,{
        "content": {
             "type" : Sequelize.STRING(2000)
            ,"field": "content"
        }
        ,"digg": {
             "type"        : Sequelize.INTEGER
            ,"allowNull"   : false
            ,"defaultValue": 0
            ,"field"       :"digg"
        }
        ,"bury": {
             "type"        : Sequelize.INTEGER
            ,"allowNull"   : false
            ,"defaultValue": 0
            ,"field"       : "bury"
        }
    }
    ,{
        "tableName": prefix + "comment"
    }
);

/* Course */
Comment.belongsTo( Course  , {"foreignKey":"course_id"} );
Course.hasMany(    Comment , {"foreignKey":"course_id"} );

/* Account */
Comment.belongsTo( Account , {"foreignKey":"account_id"} );
Account.hasMany(   Comment , {"foreignKey":"account_id"} );

module.exports = Comment;
