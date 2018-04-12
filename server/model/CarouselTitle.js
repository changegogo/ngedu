var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;

var CarouselTitle = sequelize.define('carouselTitel', {
  title: {type: Sequelize.STRING, field:'title'},
  subtitle: {type: Sequelize.STRING, field:'subtitle'},
  image: {type: Sequelize.STRING, field:'image'},
  order: {type: Sequelize.INTEGER, field:'order'},
},{
  tableName:'t_carousel_title'
})


module.exports = CarouselTitle;