var News = require("../model/News");
var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

exports.create = function(req, res){
  News.create(req.body)
    .then(function(news){
      msgResponse(req, res, '成功创建新闻');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};

exports.getAll = function(req, res){
  News.findAll()
    .then(function(news){
      res.send(news);
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};

exports.deleteById = function(req, res){
  News.destroy({where:{
    id:req.params.id
  }})
  .then(function(num){
    if(num === 1)
    {
      msgResponse(req, res, '成功删除新闻');
    }
    else{
      new Error('删除'+num+'个新闻异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};

exports.getById = function(req, res){
  News.findOne({where:{
    id:req.params.id
  }})
  .then(function(news){
    if(news === null)
    {
      throw new Error('没有找到新闻。')
    }
    else
    {
      res.send(news);
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};


exports.updateById = function(req, res){
  News.update(req.body,{where:{id:req.params.id}})
    .then(function(news){
      msgResponse(req, res, '成功更新新闻');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};
