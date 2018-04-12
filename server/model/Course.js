/**
 * course model.
 *
 * @file    Course.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

var Sequelize = require("sequelize");
var db = require("./db");
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Chapter = require("./Chapter");
var Section = require("./Section");
var Device = require("./Device");
var Post = require("./Post");
var Representation = require("./Representation");
var Business = require("./Business");
var CourseBusiness = require("./CourseBusiness");

var Course = sequelize.define(
     "course"
    ,{
        "name": {
             "type" : Sequelize.STRING(200)
            ,"field": "course_name"
        }
        ,"reviewImage": {
             "type" : Sequelize.STRING(300)
            ,"field":"review_image"
        }
        ,"courseware": {
             "type" : Sequelize.STRING(300)
            ,"field": "courseware"
        }
        ,"hour": {
             "type" : Sequelize.INTEGER
            ,"field": "hour"
        }
        ,"credit":{"type": Sequelize.INTEGER, "field": "credit"}
        ,"playedCount":{"type": Sequelize.INTEGER, "field": "played_count", defaultValue:0}
        ,"lecturer": {
             "type" : Sequelize.STRING(300)
            ,"field": "lecturer"
        }
        ,"gist": {
             "type" : Sequelize.STRING(2000)
            ,"field": "gist"
        }
        ,"description": {
             "type" : Sequelize.STRING(2000)
            ,"field": "description"
        }
        ,"remark": {
             "type" : Sequelize.STRING(2000)
            ,"field": "remark"
        }
    }
    ,{
        "tableName": prefix + "course"
    }
);


Course.belongsTo( Chapter , {/*"as":"Chapter",*/"foreignKey":"chapter_id"} );
Chapter.hasMany(  Course ,  {/*"as":"Courses",*/"foreignKey":"chapter_id"} );

Course.belongsTo( Section , {/*"as":"Section",*/"foreignKey":"section_id"} );
Section.hasMany(  Course ,  {/*"as":"Courses",*/"foreignKey":"section_id"} );

Course.belongsTo( Device , {/*"as":"Device",*/ "foreignKey":"device_id"} );
Device.hasMany(   Course , {/*"as":"Courses",*/"foreignKey":"device_id"} );

Course.belongsTo( Post ,   {/*"as":"Post",*/   "foreignKey":"post_id"} );
Post.hasMany(     Course , {/*"as":"Courses",*/"foreignKey":"post_id"} );

Course.belongsTo(       Representation , {/*"as":"Representation",*/"foreignKey":"representation_id"} );
Representation.hasMany( Course ,         {/*"as":"Courses",*/       "foreignKey":"representation_id"} );

Course.belongsToMany(   Business , {/*"as":"Businesses",*/"through":CourseBusiness} );
Business.belongsToMany( Course ,   {/*"as":"Courses",*/   "through":CourseBusiness} );

module.exports = Course;

// should include Chapter, Section, Device, Post, Business
Course.planCourses = function(courses) {
  console.assert(Array.isArray(courses), "输入必须是数组元素");
    if(courses.length == 0) return [];

  return courses.map(function(course) {
    var obj = {
      name: course.name,
      category: course.device.name,
      post: course.post?course.post.name:null, //以后可以去掉符号'?' post是必须给的.
      business:course.businesses.map(function(business){ return business.name; }), // 业务数组
      duration: parseInt(course.hour)?parseInt(course.hour):15, //FIX:真数据后就去掉冗余部分
      endTime: course.accountCourse ? course.accountCourse.updated_at : "",
      id: course.id,
      reviewImage:course.reviewImage,
    };
    return obj;
  });
};
