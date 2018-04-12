var Sequelize = require('sequelize');
var sequelize = require('./db').sequelize;

// 培训班
var Class = sequelize.define('class', {
  name:{type:Sequelize.STRING, field:'name'},
  passed:{type:Sequelize.INTEGER, field:'passed'},           //通过数量
  begin:{type:Sequelize.DATE, field:'begin_time'},                 //开始时间
  end:{type:Sequelize.DATE, field:'end_time'},                     //结束时间
  isFinish:{type:Sequelize.BOOLEAN, defaultValue:false, field:'finished'}   //是否结束
},{
  tableName:'t_class'
})




module.exports = Class;
