var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;
var Authority = require('./Authority');
var Role = require('./Role');

var RoleAuthority = sequelize.define('roleAuthority', {
},{
  tableName : 't_role_authority'
});



Role.belongsToMany(Authority, {through:RoleAuthority});
Authority.belongsToMany(Role, {through:RoleAuthority});