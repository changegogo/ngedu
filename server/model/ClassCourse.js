var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;

var Class = require('./Class');
var Course = require('./Course');

// 每个培训班对应的课程列表
var ClassCourse = sequelize.define('classCourses', {

},{
  tableName:'t_class_courses'
});


Class.belongsToMany(Course, {through:ClassCourse});
Course.belongsToMany(Class, {through:ClassCourse});


module.exports = ClassCourse;