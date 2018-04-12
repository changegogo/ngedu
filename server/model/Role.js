var Sequelize = require('sequelize');
var sequelize = require("./db").sequelize;
var Account = require('./Account');
var Role = require('./Role');//dependance
var _ = require('lodash');

/*----------  Database definition  ----------*/
var Role = sequelize.define('role', {
  name: { type: Sequelize.STRING, field: 'name' },
}, {
  tableName: 't_role'
});


module.exports = Role;

// should include Role Authority
Role.flattenRolesToAuthorites = function(roles) {
  var _unionObj = [];
  if(roles == undefined)
  {
    return [];
  }
  roles.forEach(function(role) {
    _unionObj = _.unionBy(role.authorities, _unionObj, function(role) {
      return role.id;
    });
  });
  var _rtnObj = {};
  _unionObj.forEach(function(authority){
    _rtnObj[authority.property] = true;
  })
  return _rtnObj;
}
