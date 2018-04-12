var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;
var Account = require('./Account');
var Notification = require('./Notification');

var AccountNotification = sequelize.define('accountNotification', {
},{
  tableName : 't_account_notification'
})


Account.belongsToMany(Notification, {through:AccountNotification});
Notification.belongsToMany(Account, {through:AccountNotification});