var Sequelize = require('sequelize');
var Class = require('../model/Class');
var Course = require('../model/Course');
var Account = require('../model/Account');
var Chapter = require('../model/Chapter');
var Section = require('../model/Section');
var Post = require('../model/Post');
var Device = require('../model/Device');
var Business = require('../model/Business');
var ClassCourse = require('../model/ClassCourse');
var Notification = require('../model/Notification');
var _ = require('lodash');

var errResponse = require('./responseHandle').errResponse;
var msgResponse = require('./responseHandle').msgResponse;

exports.getAllProgress = function(req, res) {
  Class.findAll({
    include: [Course, {model:Account, include:[Course]}]
  }).then(function(classes) {
    res.send(classes.map(function(c) { // c = class
      var completedAccounts = 0;
      c.accounts.forEach(function(account){
         _.intersectionWith(account.courses, c.courses, (a,b)=>{return a.id == b.id}).length == c.courses.length ? completedAccounts++ : "";
      });
      var rtnObj = {
        id: c.id,
        name: c.name,
        completed: completedAccounts, //达标人数
        total: c.accounts.length,
        courses: c.courses.length,
        startDate: c.begin,
        endDate: c.end,
        finished: c.isFinish //培训班是否结束
      };
      return rtnObj;
    }));
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });
};

exports.getClassById = function(req, res) {
  Class.findOne({
    where: { id: req.params.id },
    include: [{
      model: Course,
      include: [{
        model: Chapter
      }, {
        model: Section
      }, {
        model: Device
      },{
        model: Post
      },{
        model: Business
      }]
    }, {
      model: Account,
      include: [Course]
    }]
  }).then(function(c) {
    var rtnObj = {
      name: c.name,
    }

    // 培训班学员信息
    rtnObj.accounts = c.accounts.map(function(account) {
      return {
        id:account.id,
        name: account.realName,
        company: account.company,
        department: account.department,
        job: '研发',//TODO: add 岗位
        enrollTime: account.enrollTime,
        total: c.courses.length,
        finished: _.intersectionWith(c.courses, account.courses, (a, b) => { return a.id == b.id; }).length,
      };
    });

    // 培训班课件信息
    rtnObj.courses = Course.planCourses(c.courses);
    res.send(rtnObj);

  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.createNewClass = function(req, res){
  console.log(req.body);
  var _c, _students, _courses;
  Class.create({name:req.body.className, begin:new Date()}).then(function(c){
    _c = c;
    return Account.findAll({where:{
      $or: req.body.studentIds
    }});
  }).then(function (students) {
    _students = students;
    return Account.createNotificationForStudents({
      title:'您有新的培训班课程~',
      description:'欢迎加入《'+req.body.className+'》学习，请您尽快完成新的课程，有任何问题请技术联系我们。',
      type:'开课通知',
    }, _students);
  })
  .then(function (rtn) {
    return Course.findAll({where:{
      $or: req.body.courseIds
    }});
  })
  .then(function(courses){
    _courses = courses;
    return _c.setAccounts(_students);
  }).then(function(c){
    return _c.setCourses(_courses);
  }).then(function (c) {
    res.send({success:true, msg:'创建培训班成功'});
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  });
};

exports.finishClassById = function(req, res){
  Class.update({
    isFinish:true,
    end: new Date(),
  },
  {
    where:{
      id:req.params.id
    }
  })
  .then(function(rtn){
    if(rtn[0]===0)
    {
      throw new Error('培训班不存在。');
    }
    msgResponse(req, res, '更新培训班成功');
  })
  .catch(function(err){
    errResponse(err, req, res);
  })

};

exports.deleteClassById = function(req, res){
  Class.destroy({
    where:{
      id:req.params.id
    }
  })
  .then(function(num){
    if(num===1)
    {
      msgResponse(req, res, '成功删除一条培训班记录。');
    }
    else{
      throw new Error('删除'+num+'条培训班记录异常。');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};




