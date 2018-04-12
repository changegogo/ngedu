var Favorite = require("../model/Favorite");

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

exports.getAll = function(req, res){
  Favorite.findAll()
    .then(function(favorites){
      res.send(favorites);
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};


exports.updateById = function(req, res){
  Favorite.update(req.body, {where:{id:req.params.id}})
    .then(function(num){
    if(num.length === 1)
    {
      msgResponse(req, res, '成功更新猜你喜欢');
    }
    else{
      new Error('删除'+num+'个猜你喜欢异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};

exports.create = function(req, res){
  Favorite.create(req.body)
    .then(function(favorite){
      msgResponse(req, res, '成功创建猜你喜欢');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};