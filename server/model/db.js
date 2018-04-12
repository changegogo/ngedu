var Sequelize = require('sequelize');
var config = require('../config');
const EventEmitter = require('events');
var dbEmitter = new EventEmitter();

var tablePrefix = config.tablePrefix;
var sequelize = new Sequelize(config.connectDB, {
    define: {
        freezeTableName: true,
        paranoid: true,
        underscored: true
    }
});

sequelize.transaction(function(t){
  return new Sequelize.Promise(function(resolved, rejected){
    return resolved();
  })

  .then(function(){
    return sequelize.sync({
            force: false
        }, {
            transaction: t
        })
        .then(function() {
        });
  });
}).then(function(){
  dbEmitter.emit('sync_db');
  console.log('> Sequelize sync database successful');
}).catch(function(err){
  console.log(err);
  console.log('[debug] error happens in construct db.')
});



exports.sequelize = sequelize;
exports.tablePrefix = tablePrefix;
exports.dbEmitter = dbEmitter;