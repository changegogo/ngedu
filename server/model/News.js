var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;

var News = sequelize.define("news", {
  title: {type: Sequelize.STRING, field:'title'},
  content: {type: Sequelize.TEXT, field:'content'},
  abstract: {type: Sequelize.STRING, field:'abstract'},
  image: {type: Sequelize.STRING, field:'image'},
},{
  tableName:'t_news'
});


module.exports = News;