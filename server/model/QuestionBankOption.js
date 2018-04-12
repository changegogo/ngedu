/**
 * question bank option model.
 *
 * @file    QuestionBankOption.js
 * @author  lengchao
 * @version
 * @date    2016-07-07
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var QuestionBank = require( "./QuestionBank" );

var QuestionBankOption = sequelize.define(
    "questionBankOption"
    ,{
        "name": {
             "type" : Sequelize.STRING(2000)
            ,"field": "option_name"
        }
        ,"isRight": {
             "type"        : Sequelize.BOOLEAN
            ,"field"       : "isright"
            ,"allowNull"   : false
            ,"defaultValue": false
        }
    }
    ,{
        "tableName": prefix + "question_bank_option",
    }
);

QuestionBankOption.belongsTo( QuestionBank ,       {"foreignKey":"question_bank_id"} );
QuestionBank.hasMany(         QuestionBankOption , {"foreignKey":"question_bank_id", as:"options"} );

module.exports = QuestionBankOption;
