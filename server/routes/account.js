var express = require('express');
var router = express.Router();

var account = require('../business/account');

router.post('/signup', account.signup);
router.post('/signin', account.signin);
router.get('/logout', account.logout);
router.get('/session', account.session);

// authority
router.get('/authority', account.authority); //deprecated
router.get('/withRoles', account.getAccountsWithRoles); //获取用户列表，并包含角色
router.post('/roles', account.createRole); //创建角色
router.get('/roles', account.getAllRoles); //获得角色列表
router.get('/roles/authorities', account.getAllRolesWithAuthorities); //获得角色列表和对应权限
router.get('/roles/:id', account.getRoleDetailById); // 获取角色内容
router.get('/:id/roles', account.getRolesByAccountId); //获取用户的角色
router.post('/:id/roles', account.addRoleToAccount); //给用户指定角色
router.post('/authorities', account.createAuthority); //创建权限
router.get('/authorities', account.getAllAuthorities); //获取全部权限
router.get('/:id/authorities', account.getAuthoritesByAccountId);
router.post('/roles/:id/authorities' ,account.addAuthoritesForRole); //给角色指定权限
router.delete('/roles/:id' ,account.deleteRolebyId); //删除角色

router.get('/profile', account.getProfile);//获取当前账户基本信息 个人信息 + 课程
router.get('/profile/basic', account.getBasicProfile);//获取账户基本信息 个人信息
router.put('/profile/basic', account.updateBasicProfile);//获取账户基本信息 个人信息
router.post('/notifications', account.createNotification);
router.delete('/notifications/:id', account.deleteNotificationById);
router.put('/notifications/:id', account.readNotificationById);

router.put('/password/', account.updatePassword);

module.exports = router;