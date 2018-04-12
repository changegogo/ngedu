/**
 * examination model.
 *
 * @file    Examination.js
 * @author  lengchao
 * @version
 * @date    2016-07-23
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Account = require( "./Account" );
var QuestionBank = require( "./QuestionBank" );

var ExaminationQuestionBank = require( "./ExaminationQuestionBank" );
var ExaminationAccount = require( "./ExaminationAccount" );

var Examination = sequelize.define(
     "examination"
    ,{
        // 考试名称
        "name": {
             "type" : Sequelize.STRING(200)
            ,"field": "examination_name"
        }
        // 考试说明
        ,"description": {
             "type" : Sequelize.STRING(2000)
            ,"field": "description"
        }
        // 考试开始时间
        ,"startDate": {
             "type" : Sequelize.DATE
            ,"field": "start_date"
        }
        // 考试结束时间
        ,"endDate": {
             "type" : Sequelize.DATE
            ,"field": "end_date"
        }
    }
    ,{
        "tableName": prefix + "examination"
    }
);

// Exanination : QuestionBank
//           N : N
QuestionBank.belongsToMany( Examination ,  {"through":ExaminationQuestionBank} );
Examination.belongsToMany(  QuestionBank , {"through":ExaminationQuestionBank} );

// Exanination : Account
//           N : N
Account.belongsToMany(      Examination , {"through":ExaminationAccount} );
Examination.belongsToMany( Account ,     {"through":ExaminationAccount, as:'students'} );

module.exports = Examination;
