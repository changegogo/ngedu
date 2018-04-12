var path = require('path');

module.exports = {
    "redisHost"  : "127.0.0.1",
    "redisPort"  : "6379",
    "connectDB"  : "postgres://ngedu:ngedu123@localhost:5432/db_ngedu",
    "tablePrefix": "t_",
    "path" :{
      "root": path.join(__dirname , '../'),
      "backups": path.join(__dirname , '../backups'),
      "upload": {
        "carousel": path.join(__dirname, '../client/app/upload/carousel'),
        "news": path.join(__dirname, '../client/app/upload/news'),
        "swf": path.join(__dirname, '../client/app/upload/swf'),
      }
    },
    "bbsUrl":"http://localhost:7001"
}