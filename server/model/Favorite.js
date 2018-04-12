var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;

/*----------  Database definition  ----------*/
var Favorite = sequelize.define('favorite', {
  title: { type: Sequelize.STRING, field: 'title'},
  link: { type: Sequelize.STRING, field: 'link'},
}, {
  tableName: 't_favorite'
});


module.exports = Favorite;