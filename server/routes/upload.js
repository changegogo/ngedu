var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multer = require('multer');
var config = require('../config');
var upload = multer({dest:config.path.upload.carousel})

var uploadRoute = require('../business/uploadRoute');


router.post('/carousels', multipart({uploadDir:config.path.upload.carousel}), uploadRoute.uploadCarousel);
//router.post('/carousels', upload.array('carousel',3), uploadRoute.uploadCarousel);

router.post('/news-images', multipart({uploadDir:config.path.upload.news}), uploadRoute.uploadNews);



module.exports = router;