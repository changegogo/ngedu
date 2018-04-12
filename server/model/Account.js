var Sequelize = require('sequelize');
var sequelize = require( "./db" ).sequelize;
var Authority = require('./Authority');
var Notification = require('./Notification');

/*----------  Database definition  ----------*/
var Account = sequelize.define('account', {
  name: { type: Sequelize.STRING, field: 'name', unique:true },
  email: { type: Sequelize.STRING, field: 'email', unique:true },
  password: { type: Sequelize.STRING, field: 'password' },
  realName: { type: Sequelize.STRING, field: 'real_name' },
  company: { type: Sequelize.STRING, field: 'company' },
  department: { type: Sequelize.STRING, field: 'department' },
  post: { type: Sequelize.STRING, field: 'post' },
  sex: { type: Sequelize.STRING, field: 'sex', defaultValue:'female' },
  avatar: { type: Sequelize.STRING, field: 'avatar' },
  enrollTime: {type: Sequelize.DATE, field: 'enroll_time', defaultValue: sequelize.literal('CURRENT_DATE')},
  courseCredit: {type: Sequelize.INTEGER, field:'course_credit', defaultValue:0}
}, {
  tableName: 't_account'
});


/*----------  Database relation  ----------*/
Account.hasOne(Authority, { foreignKey: 'account_id' });


module.exports = Account;

Account.planAccount = function(account){
  return {
    username: account.name,
    email: account.email,
    realName: account.realName,
    company: account.company,
    department: account.department,
    enrollTime: account.enrollTime,
    sex: account.sex,
    avatar: account.avatar
  }
}


/*
  notification = {
      title:'',
      description:'',
      type:'',
  };
  students = [{id:''},...];
*/
Account.createNotificationForStudents = function(notification, students){
    return Sequelize.Promise.map(students, function(account, index, all){
      var accountModel ;
      return Account.findOne({
        where:{ id:account.id }
      }).then(function(account){
        accountModel = account;
        return Notification.create(notification);
      }).then(function(notification){
        return accountModel.addNotification(notification);
      }).catch(function(err){
        throw err;
      });
    })
};

