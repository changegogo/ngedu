var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;
var Account = require('./Account');
var Class = require('./Class');

var AccountClass = sequelize.define('accountClass', {
},{
  tableName : 't_account_class'
})


Account.belongsToMany(Class, {through:AccountClass});
Class.belongsToMany(Account, {through:AccountClass});