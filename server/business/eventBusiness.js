var Event = require( "../model/Event" );

var errResponse = require('./responseHandle').errResponse;
var msgResponse = require('./responseHandle').msgResponse;

exports.create = function(req, res){
  Event.create(req.body)
    .then(function(event){
      msgResponse(req, res, '成功创建通知');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};

exports.getAll = function(req, res){
  Event.findAll()
    .then(function(event){
      res.send(event);
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};

exports.deleteById = function(req, res){
  Event.destroy({where:{
    id:req.params.id
  }})
  .then(function(num){
    if(num === 1)
    {
      msgResponse(req, res, '成功删除通知');
    }
    else{
      new Error('删除'+num+'个通知异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};

exports.getById = function(req, res){
  Event.findOne({where:{
    id:req.params.id
  }})
  .then(function(event){
    if(event === null)
    {
      throw new Error('没有找到通知。')
    }
    else
    {
      res.send(event);
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};


exports.updateById = function(req, res){
  Event.update(req.body,{where:{id:req.params.id}})
    .then(function(event){
      msgResponse(req, res, '成功更新通知');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};
