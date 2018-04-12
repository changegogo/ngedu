var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;
var Account = require('./Account');
var Role = require('./Role');

var AccountRole = sequelize.define('accountRole', {
},{
  tableName : 't_account_role'
})


Account.belongsToMany(Role, {through:AccountRole});
Role.belongsToMany(Account, {through:AccountRole});