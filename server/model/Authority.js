var Sequelize = require('sequelize');
var sequelize = require("./db").sequelize;
var Authority = sequelize.define('authority', {
  name:{type:Sequelize.STRING},//权限名称
  property:{type:Sequelize.STRING},//权限属性，用于前端判断页面是否应该显示
  description:{type:Sequelize.STRING},//详细说明

  // courseManage: { type: Sequelize.BOOLEAN, field: 'course_manage', defaultValue: false }, //deprecated
  // studentManage: { type: Sequelize.BOOLEAN, field: 'student_manage', defaultValue: false }  //deprecated
}, {
  tableName: 't_authority'
});






module.exports = Authority;


Authority.planAuthority = function(auth) {
  return {
    courseManage: auth.courseManage,
    studentManage: auth.studentManage
  }
}
