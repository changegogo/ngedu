var Faq = require("../model/Faq");

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

exports.getAll = function(req, res){
  Faq.findAll()
    .then(function(faqs){
      res.send(faqs);
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};


exports.updateById = function(req, res){
  Faq.update(req.body, {where:{id:req.params.id}})
    .then(function(num){
    if(num.length === 1)
    {
      msgResponse(req, res, '成功更新常见问题');
    }
    else{
      new Error('删除'+num+'个常见问题异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};

exports.create = function(req, res){
  Faq.create(req.body)
    .then(function(favorite){
      msgResponse(req, res, '成功创建常见问题');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};

exports.deleteById = function(req, res){
  Faq.destroy({
    where:{
      id:req.params.id
    }
  })
  .then(function(num){
    if(num === 1)
    {
      msgResponse(req, res, '成功删除常见问题');
    }
    else{
      new Error('删除'+num+'个常见问题异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  }); 

}