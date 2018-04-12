var io = require('socket.io')();
var logging = io.of('/logging');
var fs = require('fs');
logging.on('connection', function(socket){
  console.log('socket.io connected')
  var length = 0;

  setInterval(function(){
    var contents = fs.readFileSync('nohup.out').toString();
    if(length === contents.length)  return;
    length = contents.length;
    socket.emit('logging updated', {
      contents:contents
    });
  }, 1000);
  // socket.on('cilent news', function(data){
  //   console.log(data);
  // });
})


module.exports = io;