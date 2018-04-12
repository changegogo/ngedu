var express = require('express');
var router = express.Router();
var system = require('../business/system');

router.post('/backups', system.createBackup);
router.get('/backups', system.listBackups);
router.delete('/backups/:filename', system.deleteBackupByFilename);
router.post('/restore/:filename', system.restoreBackupByFilename);

module.exports = router;