var exec = require('child_process').exec;
var config = require('../config');
var moment = require('moment');
var _ = require('lodash');
var fs = require('fs');


exports.createBackup = function(req, res) {

  var filename = 'backups_' + moment().format('YYYYMMDD_HHmmss_SSS') ; // random for avoiding multiple user error
  var command = 'pg_dump -Fc db_ngedu > ' + filename;


  exec(command, { cwd: config.path.backups }, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      res.send({ success: false, msg: error.message });
    } else {
      res.send({ success:true, exec: command });
    }
  });
};

exports.listBackups = function(req, res) {

  fs.readdir(config.path.backups,function(err, files){
    if (err !== null) {
      console.log('exec error: ' + err);
      res.send({ success: false, msg: error.message });
    } else {
      res.send(files);
      ;
    }
  })

};

exports.restoreBackupByFilename = function(req, res) {

  var command = 'pg_restore -c -d db_ngedu < ' + req.params.filename;
  exec(command, { cwd: config.path.backups }, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      res.send({ success: false, msg: error.message });
    } else {
      res.send({ success:true, exec: command });
    }
  });

};


exports.deleteBackupByFilename = function(req, res){
  fs.readdir(config.path.backups,function(err, files){
    if (err !== null) {
      console.log('exec error: ' + error);
      res.send({ success: false, msg: error.message });
    } else {
      var index = files.indexOf(req.params.filename);
      if(index === -1)
      {
        res.send({ success: false, msg: req.params.filename + '文件不存在' });
      }
      else
      {
        fs.unlink(config.path.backups + '/' + req.params.filename, (err) => {
          if(err !== null)
          {
            res.send({success:false, msg:err.message});
          }
          else{
            res.send({success:true, msg:'成功删除文件'});
          }
        });
      }
    }
  })

};