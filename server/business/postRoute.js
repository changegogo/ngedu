/**
 * routers for post.
 *
 * @file    postRoute.js
 * @author  lengchao
 * @version
 * @date    2016-05-17
*/

"use strict";

//var db = require( "../model/db" );
//var sequelize = db.sequelize;
var PostModel = require( "../model/Post" );
var errResponse = require("./responseHandle").errResponse;
var msgResponse = require("./responseHandle").msgResponse;

/**
 * find all list of post.
 *
 * @param request
 * @param response
 */
exports.getAllList = function( request , response ) {

    PostModel
        .findAll( {
            "order": [
                 [ "id" , "asc" ]
                ,[ "sort" , "asc" ]
            ]
        } )
        .then( function( postList ) {

            response.send( postList );
        } )
    ;
};

/**
 * create or update post data.
 *
 * @param request
 * @param response
 */
exports.post = function( request , response ) {

    var postId = request.body[ "id" ];
    var post = request.body;

    ( !postId || postId === "" )
        // create
        ? ( function() {

            PostModel
                .create( post )
                .then( function( data ) {

                    response.send( data );
                } )
            ;
        } )()
            // update
            : ( function() {

            PostModel
                .findById( postId )
                .then( function( _post ) {

                    !!_post && _post.update( post ).then( function( data ) {

                        response.send( data );
                    } )
                } )
            ;
        } )()
    ;
};

/**
 * find a model by id.
 *
 * @param request
 * @param response
 */
exports.get = function( request , response ) {

    var postId = request.params.id;

    // do query
    PostModel
        .findById( postId )
        .then( function( post ) {

            response.send( post );
        } )
    ;
};

exports.deleteById = function(req, res){
    PostModel.destroy({where:{
        id:req.params.id
    }})
    .then(function(num){
        if (num === 1)
        {
            msgResponse(req, res, '成功删除岗位。')
        }
        else{
            throw new Error('删除'+ num +'个岗位，发生异常');
        }
    })
    .catch(function(err){
        errResponse(err, req, res);
    });
};

exports.getAllPostsName = function(req, res) {
  PostModel
    .findAll({
      "order": [
        ["id", "asc"],
        ["sort", "asc"]
      ]
    })
    .then(function(postList) {
      res.send(PostModel.planPosts(postList));
    });
}
