/**
 * question bank with business association table.
 *
 * @file    QuestionBankBusiness.js
 * @author  lengchao
 * @version
 * @date    2016-07-07
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var QuestionBankBusiness = sequelize.define(
    "questionBankBusiness"
    ,{

    }
    ,{
        "tableName": prefix + "question_bank_business",
        paranoid: false,
    }
);

module.exports = QuestionBankBusiness;
