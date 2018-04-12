var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;

var Action = sequelize.define('Action', {
  operation: { type: Sequelize.STRING, field: 'operation'},
  description: { type: Sequelize.STRING, field: 'description'},
},{
  tableName: 't_action'
});

Action.belongsTo(Account, {"foreignKey": "account_id"}};

module.exports = Action;