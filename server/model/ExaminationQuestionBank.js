/**
 * examination with question bank association table.
 *
 * @file    ExaminationQuestionBank.js
 * @author  lengchao
 * @version
 * @date    2016-07-25
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var ExaminationQuestionBank = sequelize.define(
    "examinationQuestionBank"
    ,{

    }
    ,{
        "tableName": prefix + "examination_question_bank"
    }
);

module.exports = ExaminationQuestionBank;
