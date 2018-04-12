var Account = require('../model/Account');
var Course = require('../model/Course');
var Chapter = require('../model/Chapter');
var Section = require('../model/Section');
var Post = require('../model/Post');
var Device = require('../model/Device');
var Business = require('../model/Business');
var Class = require('../model/Class');
var Authority = require('../model/Authority');
var AccountCourse = require('../model/AccountCourse');

var _ = require('lodash');

var errResponse = require('./responseHandle').errResponse;
var msgResponse = require('./responseHandle').msgResponse;

var config = require('../config');
var request = require('request')

var crypto = require('crypto');
var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex')
};

exports.getAllStudents = function(req, res){
  Account.findAll({
    attributes: [
      ['real_name', 'name'], 'id', 'company', 'department', ['enroll_time', 'enrollTime']
    ],
  })
  .then(function(accounts){
    res.send(accounts)
  }).catch(function(err){
    res.send({ success: false, msg: err.message });
  });
};

exports.getAllProgress = function(req, res) {
  var _totalCourse = 0;
  Course.count().then(function(count) {
    _totalCourse = count;
    return Account.findAll({
      attributes: [
        ['real_name', 'name'], 'id', 'company', 'department', 'post', ['enroll_time', 'enrollTime']
      ],
      include: [{ model: Course }]
    });
  }).then(function(data) {

    res.send(data.map(function(account) {
      var rtnObj = {};
      rtnObj = _.extend(rtnObj, account.dataValues);
      rtnObj.total = _totalCourse;
      rtnObj.finished = account.courses.length;
      delete rtnObj.courses;
      return rtnObj;
    }));
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.getStudiedById = function(req, res) {
  Account.findOne({
    where: { id: req.params.id },
    include: [{ model: Course, include: [{ all: true }] }]
  }).then(function(account) {
    var rtnCourses = Course.planCourses(account.courses);

    res.send(rtnCourses);

  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.getProfile = function(req, res) {

  Account.findOne({
    where: { id: req.params.id },
    include: [{
      model: Class,
      where: { isFinish: false },
      required: false,
      include: [{
        model: Course,
        include: [{
          model: Chapter
        }, {
          model: Section
        }, {
          model: Device
        }, {
          model: Post
        }, {
          model: Business
        }]
      }]
    }, {
      model: Course
    }]
  }).then(function(account) {
    // 基本信息
    var rtn = {
      id: account.id,
      name: account.realName,
      company: account.company,
      department: account.department,
      post: account.post,
      enrollTime: account.enrollTime,
      class: account.classes.length>0?account.classes[0].name:'',
      sex:account.sex
    };
    // 培训班【0】中所有课程
      if(account.classes.length > 0){
        rtn.courses = Course.planCourses(account.classes[0].courses);
      }
      else rtn.courses = [];

    // 确认是否完成培训班中课程
    rtn.courses.forEach(function(classCourse){
      account.courses.some(function(studiedCourse){
        return classCourse.finished = studiedCourse.id == classCourse.id;
      });
    });

    // 已完成课数
    rtn.finished = account.courses.length;

    res.send(rtn);
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.viewCourse = function(req, res){
  var _account,
      _course;
  if (req.session.email == undefined) {
    res.send({success:false, msg:'请登录'});
  }

  Course.findOne({where:{id:req.params.courseId}})
  .then(function(course){
    if(course === null){throw new Error('课程不存在。');}
    _course = course;
    _course.playedCount++;
    return _course.save();
  })
  .then(function(){
    return Account.findOne({
      where: {email: req.session.email},
      include:[Course]
    })
  })
  .then(function(account){
    _account = account;
    return AccountCourse.findOne({
      where:{
        account_id:account.id,
        course_id:req.params.courseId
      }
    })
  })
  .then(function(account){
    if(account){
      throw new Error('您已修过该课程。');
    }
    else{
      return Course.findOne({where:{id:req.params.courseId}});
    }

  })
  .then(function(course){
    return _account.addCourse(course);
  })
  .then(function(){
    _account.courseCredit += _course.credit;
    return _account.save();
  })
  .then(function(course){
    res.send({success:true, msg:'学习课程成功'});
  }).catch(function(err){
    res.send({success:false, msg: err.message});
  });
}


exports.updateInfo = function(req, res){
  Account.update({
    realName:req.body.name,
    company:req.body.company,
    department:req.body.department,
    enrollTime:req.body.enrollTime,
    post:req.body.post
  },{
    where:{
      id:req.params.id
    }
  })
  .then(function (rtn) {
    if(rtn[0]===1)
    {
      msgResponse(req, res, '成功更改学员信息。');
    }
    else {
      throw new Error('更新学员信息异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};

// reset password to 111111
exports.resetPassword = function(req, res){
  var initialPassword = '111111';
  Account.update({
    password:md5( initialPassword)
  },{
    where:{
      id:req.params.id
    },
    returning:true
  })
  .then(function(rtn){
    if(rtn[0]===1)
    {
      request.put({
        url: config.bbsUrl + '/reset_password_to_initial',
        form: {
          email:rtn[1][0].email,
          newPassword: initialPassword 
        }
      });
      msgResponse(req, res, '成功复位密码为111111')
    }
    else {
      throw new Error('更新密码异常');
    };
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};