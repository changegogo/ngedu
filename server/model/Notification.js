var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;


/*----------  Database definition  ----------*/
var Notification = sequelize.define('notification', {
  title: {type:Sequelize.STRING },
  description: {type: Sequelize.TEXT},
  viewed: {type: Sequelize.BOOLEAN, defaultValue:false},
  type: {type:Sequelize.STRING}, // reserved
},{
  tableName: 't_notification',
})

module.exports = Notification;

