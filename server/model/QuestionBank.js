/**
 * question bank model.
 *
 * @file    QuestionBank.js
 * @author  lengchao
 * @version
 * @date    2016-07-07
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Chapter = require( "./Chapter" );
var Section = require( "./Section" );
var Device = require( "./Device" );
var Post = require( "./Post" );
var Business = require( "./Business" );
var QuestionBankBusiness = require( "./QuestionBankBusiness" );

var QuestionBank = sequelize.define(
     "questionBank"
    ,{
        "name": {
             "type" : Sequelize.STRING(2000)
            ,"field": "question_name"
        }
        ,"difficult": {
             "type" : Sequelize.INTEGER
            ,"field": "difficult"
        }
        // 是否多选
        ,"isMultiSelect": {
             "type" : Sequelize.BOOLEAN
            ,"field": "ismultiselect"
            ,defaultValue:false
        }
        // 题目类型: 选择题(ChoiceQuestion)/判断题(TrueOrFalseQuestion)
        ,"type": {
             "type" : Sequelize.STRING(20)
            ,"field": "question_type"
        }
    }
    ,{
        "tableName": prefix + "question_bank"
    }
);



QuestionBank.belongsTo( Device ,       {"foreignKey":"device_id"} );
Device.hasMany(         QuestionBank , {"foreignKey":"device_id"} );

QuestionBank.belongsTo( Post ,         {"foreignKey":"post_id"} );
Post.hasMany(           QuestionBank , {"foreignKey":"post_id"} );

QuestionBank.belongsToMany( Business ,     {"through":QuestionBankBusiness} );
Business.belongsToMany(     QuestionBank , {"through":QuestionBankBusiness} );


module.exports = QuestionBank;
