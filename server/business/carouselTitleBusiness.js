var CarouselTitle = require("../model/CarouselTitle");

var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

exports.create = function(req, res){
  CarouselTitle.create(req.body)
    .then(function(carousel){
      msgResponse(req, res, '成功创建轮播标题');
    })
    .catch(function(err){
      errResponse(err, req, res);
    })

};

exports.getAll = function(req, res){
  CarouselTitle.findAll()
    .then(function(carousels){
      res.send(carousels);
    })
    .catch(function(err){
      errResponse(err, req, res);
    })
};

exports.deleteById = function(req, res){
  CarouselTitle.destroy({where:{
    id:req.params.id
  }})
  .then(function(num){
    if(num === 1)
    {
      msgResponse(req, res, '成功删除轮播标题');
    }
    else{
      new Error('删除'+num+'个轮播图异常');
    }
  })
  .catch(function(err){
    errResponse(err, req, res);
  });
};