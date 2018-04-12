/**
 * Curriculum with business association table.
 *
 * @file    CourseBusiness.js
 * @author  lengchao
 * @version
 * @date    2016-05-17
 */

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var CourseBusiness = sequelize.define(
     "course_business"
    ,{

    }
    ,{
        "tableName": prefix + "course_business",
        paranoid: false,
    }
);

module.exports = CourseBusiness;
