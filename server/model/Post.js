/**
 * post model.
 *
 * @file    Post.js
 * @author  lengchao
 * @version
 * @date    2016-05-16
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Post = sequelize.define(
     "post"
    ,{
        "name": {
             "type" : Sequelize.STRING(200)
            ,"field": "post_name"
        }
        ,"remark": {
             "type" : Sequelize.STRING(2000)
            ,"field":"remark"
        }
        ,"sort": {
             "type"        : Sequelize.INTEGER
            ,"defaultValue": 50000
            ,"field"       : "sortnumber"
        }
    }
    ,{
        "tableName": prefix + "post"
    }
);

module.exports = Post;


// should include Post 
Post.planPosts = function(posts) {
  console.assert(Array.isArray(posts), "输入必须是数组元素");
  return posts.map(function(post) {
    return post.name;
  });

};