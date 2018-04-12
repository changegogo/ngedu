/**
 * examination with account association table.
 *
 * @file    ExaminationAccount.js
 * @author  lengchao
 * @version
 * @date    2016-07-25
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var ExaminationAccount = sequelize.define(
    "examinationAccount"
    ,{
      score:{
        type:Sequelize.FLOAT,
        field:"score"
      },
      finished:{
        type:Sequelize.BOOLEAN,
        field:"finished",
        defaultValue:false,
      }
    }
    ,{
        "tableName": prefix + "examination_account"
    }
);

module.exports = ExaminationAccount;
