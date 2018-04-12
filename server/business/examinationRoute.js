/**
 * examination route.
 *
 * @file    ExaminationRoute.js
 * @author  lengchao
 * @version
 * @date    2016-07-26
 */

"use strict";

var ExaminationModel = require( "../model/Examination" );

var AccountModel = require( "../model/Account" );
var QuestionBankModel = require( "../model/QuestionBank" );
var QuestionBankOption = require( "../model/QuestionBankOption" );
var _ = require('lodash');

var errResponse = require('./responseHandle').errResponse;
var msgResponse = require('./responseHandle').msgResponse;


/**
 * get all list of examination
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    ExaminationModel
        .findAll( {
             "order": [
                 [ "created_at" , "desc" ]
             ]
            ,"include": [
                 {"model": AccountModel, as:"students"}
                // ,{"model": QuestionBankModel}
            ]
        } )
        .then( function( examinationList ) {
            response.send( examinationList );
        } )
    ;
};

/**
 * find a model by id
 *
 * @param request
 * @param response
 */
exports.get = function( request , response ) {

    var examinationId = request.params.id;

    ExaminationModel
        .findOne( {
             "where": {
                "id": examinationId
            }
            ,"include": [
                 {"model": AccountModel}
                ,{"model": QuestionBankModel}
            ]
        } )
        .then( function( examination ) {

            response.send( examination );
        } )
    ;
};

exports.getExaminationById = function( request , response ) {

    var examinationId = request.params.id;

    ExaminationModel
        .findOne( {
             "where": {
                "id": examinationId
            }
            ,"include": [
                 {"model": AccountModel, as:"students"}
                ,{"model": QuestionBankModel, include:[{model:QuestionBankOption, as:"options"}]}
            ]
        } )
        .then( function( examination ) {

            response.send( examination );
        } )
    ;
};

exports.answerExaminationById = function(req, res){
    var examinationId = req.params.id;
    var _stu = {};

    ExaminationModel
        .findOne( {
             "where": {
                "id": examinationId
            }
            ,"include": [
                 {"model": AccountModel, as:"students"}
                ,{"model": QuestionBankModel, include:[{model:QuestionBankOption, as:"options"}]}
            ]
        } )
        .then( function( examination ) {
            var answer = req.body;

            var stu = examination.students.find(function(stu){
                return stu.id === req.session.accountId;
            });

            if(!stu) {throw new Error('当前用户无答题权限');}
            if(stu.examinationAccount.finished) {throw new Error('您已完成该项考试，请勿重复提交。');}

            if(examination.questionBanks.length === 0){throw new Error('考题为空');}
            var scorePerQuestion = 100 / examination.questionBanks.length;// length 由提交保证
            var totalScore = 0;
            examination.questionBanks.forEach(function(q,i,arr){
                var ans = _.find(answer, {id: q.id});

                if(q.type === 'ChoiceQuestion' && q.isMultiSelect)
                {
                    var trueAns = q.options.filter((e)=>{return e.isRight;}).map((e)=>{return e.id;});
                    var isAnswerCorrect = _.isEqual(trueAns.sort(), ans.answer.sort());

                }
                else{
                    var trueAns = q.options.find((e)=>{ return e.isRight}).id;
                    var isAnswerCorrect = trueAns === ans.answer;
                }
                if(isAnswerCorrect) { totalScore += scorePerQuestion;}

            });
            return stu.examinationAccount.update({score:totalScore, finished:true});
        } )
        .then(function(examinationAccount){
            res.send({success:true, msg:'考试分数为'+examinationAccount.score, score:examinationAccount.score});
        })
        .catch(function(err){
            res.send({success:false, msg:err.message});
        });
    ;
};

exports.create = function(req, res){


    var _examination, _students, _questions;

    ExaminationModel.create({
        name:req.body.name,
        description:req.body.description,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
    }).then(function(examination){
        _examination = examination;

        return AccountModel.findAll({where:{
            id:req.body.students,
        }})
    }).then(function(students){
        _students = students;
        return QuestionBankModel.findAll({where:{
            id:req.body.questions
        }})
    }).then(function(questions){
        _questions = questions;
    }).then(function(){
        return _examination.addStudents(_students);
    }).then(function(){
        return _examination.addQuestionBanks(_questions);
    }).then(function(){
        res.send({success:true, msg:'成功创建考试'});
    }).catch(function(err){
        res.send({success:false, msg:err.message});
    });


};

exports.deleteExaminationById = function(req, res){
    ExaminationModel.destroy({where:{
        id:req.params.id
    }})
    .then(function(num){
        if(num > 0)
        {
            msgResponse(req,res, '成功删除考试')
        }
        else{
            throw new Error('删除失败，考试不存在。')
        }
    })
    .catch(function(err){
        errResponse(err, req, res);
    });
};


exports.getMyList = function(req, res){
    AccountModel.findOne({where:{
        id: req.session.accountId
    },include:[ExaminationModel]})
    .then(function(account){
        if(account === null){throw  new Error('当前账户不存在');}
        res.send(account.examinations);
    })
    .catch(function(err){
        errResponse(err,req, res);
    })


};