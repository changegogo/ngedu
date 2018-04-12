var errResponse = function(err, req, res){
  res.send({success:false, err:err.message});
};

var msgResponse = function(req, res, msg){
  res.send({success:true, msg:msg});
};


exports.errResponse = errResponse;
exports.msgResponse = msgResponse;