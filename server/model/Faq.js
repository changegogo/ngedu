var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;

var Faq = sequelize.define("Faq", {
  title: {type: Sequelize.STRING, field:'title'},
  description: {type: Sequelize.TEXT, field:'description'},
},{
  tableName:'t_faq'
});


module.exports = Faq;