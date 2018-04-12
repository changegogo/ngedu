var Sequelize = require("sequelize");
var sequelize = require("./db").sequelize;
var Course = require("./Course");
var Account = require("./Account");


/*----------  Database Model Definition  ----------*/
// 学员已学课程列表
var AccountCourse = sequelize.define('accountCourse', {
},{
  tableName:'t_account_course'
});



Account.belongsToMany(Course, {through:AccountCourse});
Course.belongsToMany(Account, {through:AccountCourse});

module.exports = AccountCourse;
