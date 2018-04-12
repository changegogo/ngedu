/**
 * api routing.
 *
 * @file    api.js
 * @author  lengchao
 * @version
 * @date    2016-05-14
 */

"use strict";

var express = require( "express" );
var app = express();

// device about.
var deviceRoute = require( "../business/deviceRoute" );
app.get( "/device/all" , deviceRoute.getAllList );
app.post( "/device" , deviceRoute.post );
app.get( "/device/:id" , deviceRoute.get );
app.get( "/devices" , deviceRoute.getAllDevicesName );
app.delete( "/devices/:id" , deviceRoute.deleteDevicesById );


// post about.
var postRoute = require( "../business/postRoute" );
app.get( "/post/all" , postRoute.getAllList );
app.post( "/post" , postRoute.post );
app.get( "/post/:id" , postRoute.get );
app.get( "/posts" , postRoute.getAllPostsName );
app.delete( "/posts/:id" , postRoute.deleteById);

// representation about.
var representationRoute = require( "../business/representationRoute" );
app.get( "/representation/all" , representationRoute.getAllList );
app.post( "/representation" , representationRoute.post );
app.get( "/representation/:id" , representationRoute.get );
app.delete( "/representations/:id" , representationRoute.deleteById );

// business about.
var businessRoute = require( "../business/businessRoute" );
app.get( "/business/all" , businessRoute.getAllList );
app.post( "/business" , businessRoute.post );
app.get( "/business/:id" , businessRoute.get );
app.get( "/businesses" , businessRoute.getAllBusinessesName );
app.delete( "/businesses/:id" , businessRoute.deleteById );

// chapter about.
var chapterRoute = require( "../business/chapterRoute" );
app.get( "/chapter/all" , chapterRoute.getAllList );
app.post( "/chapter" , chapterRoute.post );
app.get( "/chapter/:id" , chapterRoute.get );

// section about.
var sectionRoute = require( "../business/sectionRoute" );
app.get( "/section/all" , sectionRoute.getAllList );
app.post( "/section" , sectionRoute.post );
app.get( "/section/:id" , sectionRoute.get );

// upload about.
var uploadRoute = require( "../business/uploadRoute" );
app.post( "/upload/course" , uploadRoute.courseUpload );
app.post( "/upload/course/pdf" , uploadRoute.coursePdfUpload );
app.post( "/upload/course/swf" , uploadRoute.courseSwfUpload );
app.post( "/upload/thumbnail" , uploadRoute.thumbnailUpload );

// course about.
var courseRoute = require( "../business/courseRoute" );
app.get( "/course/all" , courseRoute.getAllList );
app.get( "/course/search" , courseRoute.search );
app.get("/courses/lastThreeMP4Courses", courseRoute.lastThreeMP4Courses);
app.post( "/course" , courseRoute.post );
app.post( "/course/:id" , courseRoute.post );
app.get( "/course/:id" , courseRoute.get );
app.get( "/courses" , courseRoute.getAllCourses); //only courses info
app.delete( "/courses/:id" , courseRoute.deleteById);

// training about.
app.get( "/training/played-most", courseRoute.getPlayedMostByQuery );
app.get( "/training/:id" , courseRoute.get );
app.get( "/training/device/:id" , courseRoute.getAllListByDevice );
app.get( "/training/device/:id/new" , courseRoute.getNewListByDevice );
app.get( "/training/post/:id" , courseRoute.getAllListByPost );
app.get( "/training/post/:id/new" , courseRoute.getNewListByPost );
app.get( "/training/business/:id" , courseRoute.getAllListByBusiness );
app.get( "/training/business/:id/new" , courseRoute.getNewListByBusiness );

// comment
var commentRoute = require( "../business/commentRoute" );
app.get( "/comment/list/:courseId" , commentRoute.getAllListByCourse );
app.post( "/comment" , commentRoute.post );

// question bank and option
var questionBankRoute = require( "../business/questionBankRoute" );
app.post( "/question-bank" , questionBankRoute.saveOrUpdate );
app.post( "/question-bank/:id(\\d+)" , questionBankRoute.saveOrUpdate );
app.get( "/question-bank/all" , questionBankRoute.getAllList );
app.get( "/question-bank/:id(\\d+)" , questionBankRoute.get );
app.delete( "/question-bank/:id(\\d+)" , questionBankRoute.delete );

// examination
var examination = require( "../business/examinationRoute" );
app.post("/examinations", examination.create);
app.get("/examinations", examination.getAllList);
app.get("/examinations/:id(\\d+)", examination.getExaminationById);
app.delete("/examinations/:id(\\d+)", examination.deleteExaminationById);
app.post("/examinations/:id(\\d+)/answer", examination.answerExaminationById);
app.get("/examinations/my", examination.getMyList);

var carousel = require("../business/carouselTitleBusiness");
app.post("/carousel-titles", carousel.create);
app.get("/carousel-titles", carousel.getAll);
app.delete("/carousel-titles/:id", carousel.deleteById);

var news = require("../business/newsBusiness");
app.post("/news", news.create);
app.put("/news/:id", news.updateById);
app.get("/news", news.getAll);
app.delete("/news/:id", news.deleteById);
app.get("/news/:id", news.getById);

var event = require("../business/eventBusiness");
app.post("/events", event.create);
app.put("/events/:id", event.updateById);
app.get("/events", event.getAll);
app.delete("/events/:id", event.deleteById);
app.get("/events/:id", event.getById);

var favorite = require("../business/favoriteBusiness");
app.get("/favorites", favorite.getAll);
app.put("/favorites/:id", favorite.updateById);
app.post("/favorites", favorite.create);


var faq = require("../business/faqBusiness");
app.get("/faqs", faq.getAll);
app.put("/faqs/:id", faq.updateById);
app.post("/faqs", faq.create);
app.delete("/faqs/:id", faq.deleteById);

module.exports = app;
