var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;

var Event = sequelize.define("Event", {
  title: {type: Sequelize.STRING, field:'title'},
  location: {type: Sequelize.STRING, field:'location'},
  description: {type: Sequelize.STRING, field:'description'},
  begin:{type:Sequelize.DATE, field:'begin'},
  end:{type:Sequelize.DATE, field:'end'},
},{
  tableName:'t_event'
});


module.exports = Event;