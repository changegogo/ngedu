var Sequelize = require('sequelize');
var Account = require('../model/Account');
var Role = require('../model/Role');
var Class = require('../model/Class');
var Business = require('../model/Business');
var Post = require('../model/Post');
var Device = require('../model/Device');
var Section = require('../model/Section');
var Course = require('../model/Course');
var Chapter = require('../model/Chapter');
var Authority = require('../model/Authority');
var Notification = require('../model/Notification');
var AccountCourse = require("../model/AccountCourse");
var AccountClass = require("../model/AccountClass");
var AccountNotification = require('../model/AccountNotification');
var AccountRole = require("../model/AccountRole");
var RoleAuthority = require("../model/RoleAuthority");

var dbEmitter = require('../model/db').dbEmitter;

var config = require('../config');

var errResponse = require('./responseHandle').errResponse;
var msgResponse = require('./responseHandle').msgResponse;

var request = require('request')

var crypto = require('crypto');
var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex')
};


exports.signup = function(req, res) {
  console.log(req.body);
  console.log(md5)
  var _account = {};
  var name = req.body.name,
    email = req.body.email,
    password = req.body.password;



  request.post({
    url:config.bbsUrl + '/signup',
    form:{
      email:email,
      loginname:name,
      pass:password,
      re_pass:password,
    }
  },
    function (err, httpResponse, body) {
      if(!httpResponse || httpResponse.statusCode !== 200)
      {
        res.send({success:false, msg:'请检查输入是否正确。'})
      }
      else{
        Account.create({ name: name, email: email, password: md5(password) ,realName: name})
          .then(function(account){
            _account = account;
            if(account.name === 'admin'){
              return Role.findOne({
                  where:{name:'系统管理员'}
                })
                .then(function(role){
                  return _account.addRole(role)
                      .then(function () {
                          return Account.findOne({
                              where:{name:'admin'},
                              include: [{
                                model: Role,
                                include: [Authority]
                              }]
                          });
                  });
                });
            }
            else {
              return account;
            }
          })
          .then(function(account) {
            var rtnObj = {
              auth: Role.flattenRolesToAuthorites(account.roles),
              profile: Account.planAccount(account)
            };
            res.send({ success: true, msg: '账号注册成功！', data: rtnObj});
          }).catch(function(err) {
            console.log(err);
            res.send({ success: false, msg: err.message });
          });
      }

    }
  );

  




};

exports.signin = function(req, res) {
  var name = req.body.name,
    password = req.body.password;
  Account.findOne({
    where: { name: name, password: md5(password) },
    include: [{
      model: Role,
      include: [Authority]
    }]
  }).then(function(account) {
    if (account == null) {
      throw new Error('用户名或密码错误');
    }
    req.session.email = account.email;
    req.session.accountId = account.id;
    var rtnObj = {
      auth: Role.flattenRolesToAuthorites(account.roles),
      profile: Account.planAccount(account)
    }
    res.send({ success: true, msg: 'login successful', data: rtnObj });
  }).catch(function(err) {
    console.log(err);
    res.send({ success: false, msg: err.message });
  });

  console.log(req.body);
};

exports.authority = function(req, res) {
  if (req.session.email == undefined) {
    res.send({ auth: {} })
  }
  Account.findOne({
    where: { email: req.session.email },
    include: [{
      model: Role,
      include: [Authority]
    }]
  }).then(function(account) {
    res.send({ auth: Role.flattenRolesToAuthorites(account.roles) });
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.logout = function(req, res) {
  if (req.session.email == undefined) {
    res.send({ success: false, msg: '当前用户未登录' });
  }




  req.session.destroy(function(err) {
    // cannot access session here
  })
  res.clearCookie('node_club', { path: '/' });
  res.clearCookie('ngedu', { path: '/' });
  res.clearCookie('connect.sid', { path: '/' });
  res.send({ success: true, msg: '用户已登出。' });
};

exports.session = function(req, res) {
    Account.findOne({
      where: { email: req.session.email },
      include: [{
        model: Role,
        include: [Authority]
      }]
    }).then(function(account) {
      if(account == null){throw new Error('无session信息')}
      var rtnObj = {
        auth:  Role.flattenRolesToAuthorites(account.roles),
        profile: Account.planAccount(account)
      }
      res.send({ success: true, msg: '成功获取Session信息。', data: rtnObj });
    }).catch(function(err) {
      res.send({ success: false, msg: err.message });
    });
}



exports.createRole = function(req, res) {
  var _role;
  Role.create({ name: req.body.name }).then(function(role) {
    _role = role;
    return Authority.findAll({
      where: {
        $or: req.body.authorities
      }
    })
  }).then(function(authorities) {
    return _role.addAuthorities(authorities);
  }).then(function(role) {
    res.send({ success: true, msg: '创建角色成功' });
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.addRoleToAccount = function(req, res) {
  var _account;
  Account.findById(req.params.id, {
      include: [Role]
    }) // TODO: 增加真实id
    .then(function(account) {
      _account = account;
      return account.removeRoles(account.roles);
    }).then(function(removeCount) {
      return Role.findAll({
        where: {
          $or: req.body.roles 
        }
      })
    }).then(function(roles) {
      return _account.addRoles(roles);
    }).then(function(account) {
      res.send({ success: true, msg: '账号关联角色成功' });
    }).catch(function(err) {
      res.send({ success: false, msg: err.message });
    });


};


exports.createAuthority = function(req, res) {
  Authority.bulkCreate(req.body).then(function(authorities) {
    res.send({ success: true, msg: '权限创建成功' });
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  })

};

exports.addAuthoritesForRole = function(req, res) {
  var _role = {};
  Role.findById(req.params.id, {
    include: [Authority]
  }).then(function(role) {
    _role = role;
    if (role != undefined) {
      return role.removeAuthorities(role.authorities,{force:true});
    }
    throw new Error('要删除的角色不存在！');
  }).then(function(num) {
    return Authority.findAll({
      where: {
        $or: req.body.authorities
      }
    })
  }).then(function(authorities) {
    return _role.addAuthorities(authorities);
  }).then(function(num) {
    res.send({ success: true, msg: '给角色添加权限成功' });
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });
};

exports.getAuthoritesByAccountId = function(req, res) {
  Account.findById(req.params.id, {
    include: [{
      model: Role,
      include: [Authority]
    }]
  }).then(function(account) {
    if (account != null) {
      res.send(Role.flattenRolesToAuthorites(account.roles));
    } else {
      throw new Error('账号不存在');
    }
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  })
};

exports.getRoleDetailById = function(req, res) {
  Role.findById(req.params.id, {
    include: [Authority]
  }).then(function(role) {
    if (role != null) {
      res.send(role);
    } else {
      throw new Error('角色不存在');
    }
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });

};

exports.getRolesByAccountId = function(req, res) {

};

exports.getAccountsWithRoles = function(req, res) {
  Account.findAll({
    attributes:[ 'company', 'department', ['real_name', 'name'], 'enrollTime', 'id'],
    include:[{
      model:Role,
      attributes:['id', 'name'],
      through:{
        attributes:[]
      }
    }]
  }).then(function(accounts){
    res.send(accounts);
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  })
}

exports.getAllRoles = function(req, res){
  Role.findAll({
    attributes:['id','name']
  }).then(function(roles){
    res.send(roles);
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  });
};

exports.getAllRolesWithAuthorities = function(req, res){
  Role.findAll({
    attributes:['id','name'],
    include:[{
      model:Authority,
      attributes:['name', 'id'],
      through:{
        attributes:[]
      }
    }]
  }).then(function(roles){
    res.send(roles);
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  });
};

exports.getAllAuthorities = function(req, res){
  Authority.findAll({
    attributes:['id', 'name']
  }).then(function(authorities){
    res.send(authorities);
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  })
};

exports.deleteRolebyId = function(req, res){
  Role.destroy({
    where:{
      id: req.params.id
    }
  }).then(function(num){
    if(num > 0)
    {
      res.send({success:true, msg:'删除角色成功'})
    }
    else{
      res.send({success:false, msg:'角色不存在'})
    }
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  })

};


exports.getProfile = function(req, res){
  if(!req.session || !req.session.accountId)
  {
    res.send({success:false, msg:'请登录后再操作。'});
    return;
  }
  Account.findOne({
    where:{id:req.session.accountId},
    include:[{
      model: Class,
      where: { isFinish: false },
      required: false,
      include: [{
        model: Course,
        include: [
        { model: Chapter }, 
        { model: Section }, 
        { model: Device }, 
        { model: Post }, 
        { model: Business }]
      }]
    }, {
      model: Course
    },{
      model: Notification,
      attributes:['title', 'description', 'type', ['created_at', 'createdAt'],'viewed', 'id'],
      through:{
        attributes:[]
      }
    }]
  }).then(function(account) {
    // 基本信息
    var rtn = {
      id: account.id,
      name: account.realName,
      company: account.company,
      post: account.post,
      department: account.department,
      enrollTime: account.enrollTime,
      class: account.classes.length>0?account.classes[0].name:'',
      sex:account.sex,
      notifications: account.notifications,
      courseCredit:account.courseCredit
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

/**
 * 批量创建消息
 * demo <request body>
{
    "msg":{
        "title":"测试消息{{$randomInt}}",
        "description":"测试内容", 
        "viewed":true,
        "type":"推送"
    },
    "accounts":[
        {"id":1},
        {"id":3}
        ]
}
*/
exports.createNotification = function(req, res){
  var _title = req.body.msg.title;
  var _description = req.body.msg.description;
  var _type = req.body.msg.type;
  var _viewed = req.body.msg.viewed;

  new Sequelize.Promise(function(resolved, rejected){
    return resolved();
  })
  .then(function(){
    return Account.createNotificationForStudents({
      title:_title,
      description:_description,
      type:_type,
    },req.body.accounts);
  })
  .then(function(data){
    res.send({success:true, msg:'消息群发成功！'});
  }).catch(function(err){
    res.send({success:false, msg:err.message});
  });
};

exports.deleteNotificationById = function(req, res){
  Notification.destroy({
    where:{id:req.params.id}
  }).then(function(number){
    res.send({success:true, msg:'删除'+number+'条记录。'});
  }).catch(function(err){
    res.send({success:false, msg:err.msg});
  });
};

exports.readNotificationById = function(req, res){
  Notification.findOne({
    where:{id:req.params.id}
  }).then(function(notification){
    return notification.update({viewed: true});
  }).then(function(data){
    res.send({success:true, msg:data});
  }).catch(function(err){
    res.send({success:false, msg:err.msg});
  })
};

exports.getBasicProfile = function(req, res){
  Account.findOne({
    where:{email:req.session.email},
  }).then(function(account) {
    // 基本信息
    var rtn = {
      id: account.id,
      name: account.name,
      realName: account.realName,
      email: account.email,
      company: account.company,
      post: account.post,
      department: account.department,
      enrollTime: account.enrollTime,
      sex:account.sex,
    };

    res.send(rtn);
  }).catch(function(err) {
    res.send({ success: false, msg: err.message });
  });
};

exports.updateBasicProfile = function(req, res){
  var _body = req.body;
  Account.findOne({
    where:{email:req.session.email},
  }).then(function(account){
    return account.update({
      email: _body.email,
      realName: _body.realName,
      company: _body.company,
      post: _body.post,
      department: _body.department,
      enrollTime: _body.enrollTime,
    }).then(function(response){
      res.send({success:true, msg:'更新用户成功!'});
    }).catch(function(err){
      res.send({ success: false, msg: err.message });
    })

  })

};

exports.updatePassword = function(req, res, next){
  console.log('hello');
  request.put({
    url: config.bbsUrl + '/reset_password',
    form: {
      email:req.body.email,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword
    }
  },function(err, httpResponse, body){
      if(err)
      {
        next(err);
        return;
      }
      if(httpResponse.statusCode !== 200)
      {
        body = JSON.parse(body);
        res.send({success:false, msg: body.msg?body.msg:'请检查输入是否正确。'})
      }
      else{
        Account.update({
          password:md5(req.body.newPassword)
        }, {
          where:{
            email:req.body.email
          },
        })
        .then(function(rtn){
          if(rtn[0] === 1)
          {
            msgResponse(req, res, '密码更新成功');
          }
          else{
            throw new Error('成功更新'+rtn[0]+'个密码');
          }
        })
        .catch(function(err){
          errResponse(err, req, res);
        })

      }
  })
};



function initAuthorites() {
    var _authorities = {};
    var _role = {};
    var dafaultName = 'admin';
    var defaultEmail = 'admin@admin';
    var defaultRealName = '系统管理员';
    var defaultPassword = '123456';

    var defaultAuthorites = [{
        "name": "学员管理",
        "property": "studentManage",
        "description": "学员管理"
    }, {
        "name": "课程管理",
        "property": "courseManage",
        "description": "课程管理"
    }, {
        "name": "权限管理",
        "property": "AuthoriyManage",
        "description": "权限管理"
    }, {
        "name": "考试管理",
        "property": "ExamManage",
        "description": "考试管理"
    }, {
        "name": "系统维护管理",
        "property": "SystemManage",
        "description": "系统维护管理"
    }, {
        "name": "网站管理",
        "property": "WebsiteManage",
        "description": "系统维护管理"
    }];

    Authority.findAll({
        attributes: ['id', 'name']
    }).then(function(authorities) {
        // 需要初始化
        if (authorities.length === 0 ) {
            return Authority.bulkCreate(defaultAuthorites)
                .then(function() {
                  return Authority.findAll({attributes: ['id', 'name'] });
                }).then(function (authorities) {
                  _authorities = authorities;
                  return Role.create({ name: '系统管理员' });
                })
                .then(function(role){
                  _role = role;
                  return role.addAuthorities(_authorities);
                })
                .then(function(rtn){
                  console.log('> Create default 系统管理员 successful');
                });
        };
        // 不需要初始化
    }).catch(function(err) {
        console.log('Error:Create default authorities failed.');
        console.log(err.message)
    });


};


dbEmitter.on('sync_db', function () {
    initAuthorites();
})
