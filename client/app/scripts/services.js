"user strict";

var app = angular.module( "ngedu" );
// app.constant('baseURL', 'http://localhost:7000');
app.constant('baseURL', '');

app.service( "mainServices" , [ function() {

} ] );

/**
 * upload about
 */
app.service( "uploadService" , function() {

    /**
     * create component of uploadify.
     *
     * @param element
     * @param settings configuration
*/
    this.createUploadify = function( element , settings ) {

        if( !( element instanceof jQuery ) ) {

            element = $( element );
        }

        settings = jQuery.extend( true , {
             "swf"          : "/bower_components/uploadify/uploadify.swf"
            ,"uploader"     : "uploadify.php"
            ,"auto"         : true
            ,"buttonText"   : "选择"
            ,"fileObjName"  : "uploadFile"
            ,"fileSizeLimit": "100M"
            ,"fileTypeExts" : "*.mp4;*.avi;*.pdf;"
            ,"fileTypeDesc" : "请选择\"*.mp4, *.avi, *.pdf\"文件！"
            // JSON格式上传每个文件的同时提交到服务器的额外数据，可在’onUploadStart’事件中使用’settings’方法动态设置
            ,"formData"     : {}
            ,"multi"        : false
            ,"width"        : 54
            ,"height"       : 34
        } , settings );

        element.uploadify( settings );

        return element;
    };
} );

/**
 * course
 */
app.service(
     "courseService"
    ,[
         "$resource"
        ,"$state"
        ,"uploadService"
        ,"chapterService"
        ,"sectionService"
        ,"representationService"
        ,"deviceService"
        ,"postService"
        ,"businessService"
        ,"baseURL"
        ,function(
             $resource
            ,$state
            ,uploadService
            ,chapterService
            ,sectionService
            ,representationService
            ,deviceService
            ,postService
            ,businessService
            ,baseURL
        ) {

            /**
             * To replace a course instruction in the template data list
             *
             * @param templateUrl template url
             * @param data        course data list
             * @returns {string}
             */
            this.replaceCourseDirectiveData = function( templateUrl , data ) {

                var html = $( "#" + templateUrl ).html();

                // replace empty character
                html = javask.string.replaceAll( html , /\t/ , "" );
                html = javask.string.replaceAll( html , /\r\n/ , "\n" );
                html = javask.string.replaceAll( html , /\n/ , "" );
                // replace course data.
                html = javask.string.replaceAll( html , "{{course.lecturer}}" , data.lecturer );
                html = javask.string.replaceAll( html , "{{course.representation}}" , data.representation.name );
                html = javask.string.replaceAll( html , "{{course.remark}}" , data.remark );
                html = javask.string.replaceAll( html , "{{course.gist}}" , data.gist );
                html = javask.string.replaceAll( html , "{{course.description}}" , data.description );
                html = javask.string.replaceAll( html , "{{course.post.name}}" , data.post.name );
                html = javask.string.replaceAll( html , "{{course.representation.name}}" , data.representation.name );

                return html;
            };

            /**
             * craete courseware upload component.
             */
            this.createCoursewareUploadify = function( scope ) {

                uploadService.createUploadify( "#coursewareUpload" , {
                     "fileSizeLimit"  : "100MB"
                    ,"uploader"       : "/api/upload/course"
                    ,"fileTypeExts"   : "*.mp4;*.zip;*.pdf;"
                    ,"fileTypeDesc"   : "请选择\"*.mrp4\"文件！"
                    ,"onUploadStart": function(file){
                        var type = file.type.toLowerCase()
                        switch(type)
                        {
                            case '.mp4':{
                               $('#coursewareUpload').uploadify('settings', 'uploader','/api/upload/course');
                               break;
                            }
                            case '.zip':{
                               $('#coursewareUpload').uploadify('settings', 'uploader','/api/upload/course/swf');
                               break;
                            }
                            case '.pdf':{
                               $('#coursewareUpload').uploadify('settings', 'uploader','/api/upload/course/pdf');
                               break;
                            }
                            default :{
                               $('#coursewareUpload').uploadify('cancel');
                               bootbox.alert('上传失败，错误的文件类型。')
                            }
                        }
                    }
                    /**
                     * upload file success.
                     *
                     * @param file file object
                     * @param data output information from server.
                     */
                    ,"onUploadSuccess": function( file , data ) {

                        data = angular.fromJson( data );

                        if( data.success ) {

                            // scope 中的 model 是备,使用 $apply 来赋值
                            var theScope = scope;
                            scope.$apply( function() {

                                theScope.courseModel.courseware = data.fileName;
                            } );

                            //$( "#courseware" ).blur();
                        }
                    }
                } );
            };

            /**
             * craete thumbnail upload component.
             */
            this.createThumbnailUploadify = function( scope ) {

                uploadService.createUploadify( "#reviewImageUpload" , {
                     "fileSizeLimit": "2MB"
                    ,"uploader"     : "/api/upload/thumbnail"
                    ,"fileTypeExts" : "*.jpg;*.gif;*.png;*.bmp;"
                    ,"fileTypeDesc" : "请选择\"*.jpg;*.gif;*.png;*.bmp;\"文件！"
                    /**
                     * upload file success.
                     *
                     * @param file file object
                     * @param data output information from server.
                     */
                    ,"onUploadSuccess": function( file , data ) {

                        data = angular.fromJson( data );

                        if( data.success ) {

                            // scope 中的 model 是备,使用 $apply 来赋值
                            var theScope = scope;
                            scope.$apply( function() {
                                theScope.courseModel.reviewImage = data.fileName;
                            } );

                            $( "#reviewImage" ).attr( "src" , data.fileName )
                        }
                    }
                } );
            };

            /**
             * find all list of course
             */
            this.getAllList = function() {
                return $resource( "/api/course/all" ).query();
            };

            /**
             * find all list of course by device.
             *
             * @param deviceId
             */
            this.getAllListByDevice = function( deviceId ) {

                return $resource( "/api/training/device/:id" , {
                    "id": "@id"
                } ).query( {
                    "id": deviceId
                } );
            };

            /**
             * find new list of course by device.
             *
             * @param deviceId
             */
            this.getNewListByDevice = function( deviceId ) {

                return $resource( "/api/training/device/:id/new" , {
                    "id": "@id"
                } ).query( {
                    "id": deviceId
                } );
            };

            /**  getPlayedMostByQuery
             *   option = {
             *       chapterId:id,
             *       deviceId:id,
             *       postId:id
             *  } 
            */            
            this.getPlayedMostByQuery =  function( option ){
                return $resource("/api/training/played-most").query(option);
            };

            this.getAllListByPost = function( postId ) {

                return $resource( "/api/training/post/:id" , {
                    "id": "@id"
                } ).query( {
                    "id": postId
                } );
            };

            /**
             * find new list of course by post.
             *
             * @param postId
             */
            this.getNewListByPost = function( postId ) {

                return $resource( "/api/training/post/:id/new" , {
                    "id": "@id"
                } ).query( {
                    "id": postId
                } );
            };

            /**
             * find all list of course by business.
             *
             * @param postId
             */
            this.getAllListByBusiness = function( businessId ) {

                return $resource( "/api/training/business/:id" , {
                    "id": "@id"
                } ).query( {
                    "id": businessId
                } );
            };

            /**
             * find new list of course by business.
             *
             * @param postId
             */
            this.getNewListByBusiness = function( businessId ) {

                return $resource( "/api/training/business/:id/new" , {
                    "id": "@id"
                } ).query( {
                    "id": businessId
                } );
            };

            /**
             * find one course model data by id
             *
             * @param id
             */
            this.getCourseById = function( id ) {

                return $resource( "/api/course/:id" , {
                    "id": "@id"
                } ).get( {
                    "id": id
                } );
            };

            this.deleteCourseById = function(id){
                return $resource("/api/courses/:id", {id:id}).delete();
            }

            /**
             * submit the form data.
             *
             * @param courseModel course model quote
             */
            this.saveOrUpdate = function( courseModel ) {

                var tips = "{operator}成功！";
                tips = tips.replace(/\{operator\}/, !!courseModel.id ? "修改" : "添加" );

                if( javask.string.blank( courseModel.reviewImage ) ) {

                    courseModel.reviewImage = "/upload/thumbnail/02E7037A96E4B635CEE3F3B0F829AC8E.jpg";
                }

                return !!courseModel && $resource( "/api/course/:id",{id:'@id'} ).save( courseModel , function() {

                    bootbox.alert( tips , function() {

                            $state.go( "course" );
                        }
                    );
                } );
            };

            /**
             * begin to learn
             *
             * @param event
             */
            var computingScale = function( currentTime , duration ) {

                if( isNaN( currentTime ) || isNaN( duration ) || currentTime < 1 || duration < 1 ) {

                    return 0;
                }

                currentTime += 0;
                duration += 0;

                var scale = duration <= 5
                    ? 1
                    : ( currentTime / duration ).toFixed( 2 )
                ;
                scale *= 100;

                return scale;
            };
            var viewCourse = function( courseId ) {

                return $resource( baseURL + "/students/viewCourse/:courseId" , {
                    "courseId": "@id"
                } ).save( {
                    "id": courseId
                } );
            };
            this.startStudy = function( event , interval , courseId ) {

                var button = angular.element( event.target );
                // remove button
                button.parent().remove();

                var video = document.getElementById( "coursePlay" );
                // start playing video
                video.play();

                // Computing broadcast schedule
                var duration = video.duration;
                var scale = 0;
                var timer = interval( function() {

                    scale = computingScale( video.currentTime , duration );
                    console.log( scale );
                    scale > 80
                        && interval.cancel( timer )
                        && viewCourse( courseId )
                    ;
                } , 1000 * 1 );
            };

            this.viewCourse = viewCourse;

            this.getAllCourses = function(){
                return $resource(baseURL + '/api/courses').query();
            };

            this.getLastThreeMP4Courses = function(){
                return $resource(baseURL + '/api/courses/lastThreeMP4Courses').query();
            };

            /********************************************************************************/
            /**
             * 获取搜索条件相关数据
             *
             * @param scope
             * @param stateParams
             */
            this.getDataOfSearchAbout = function( scope , stateParams ) {

                // define search model
                scope.courseSearchModel = {};
                scope.courseSearchModel.sort = !!stateParams.sort ? stateParams.sort : "hour_asc";
                scope.businessArray = [];

                // chapter list
                chapterService.getAllList().$promise.then( function( chapterList ) {

                    chapterList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择章"
                        ,"remark": "请选择章"
                    } );
                    scope.chapterList = chapterList;
                    scope.courseSearchModel.chapterId = !!stateParams.chapterId ? stateParams.chapterId * 1 : scope.chapterList[ 0 ].id;
                    console.log( scope.courseSearchModel );
                } );
                // section list
                sectionService.getAllList().$promise.then( function( sectionList ) {

                    sectionList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择节"
                        ,"remark": "请选择节"
                    } );
                    scope.sectionList = sectionList;
                    scope.courseSearchModel.sectionId = !!stateParams.sectionId ? stateParams.sectionId * 1 : scope.sectionList[ 0 ].id;
                } );
                // device list
                deviceService.getAllList().$promise.then( function( deviceList ) {

                    deviceList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择设备"
                        ,"remark": "请选择设备"
                    } );
                    scope.deviceList = deviceList;
                    scope.courseSearchModel.deviceId = !!stateParams.deviceId ? stateParams.deviceId * 1 : scope.deviceList[ 0 ].id;
                } );
                // representation list
                representationService.getAllList().$promise.then( function( representationList ) {

                    representationList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择文件格式"
                        ,"remark": "请选择文件格式"
                    } );
                    scope.representationList = representationList;
                    scope.courseSearchModel.representationId = !!stateParams.representationId ? stateParams.representationId * 1 : scope.representationList[ 0 ].id;
                } );
                // post list
                postService.getAllList().$promise.then( function( postList ) {

                    postList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择岗位"
                        ,"remark": "请选择岗位"
                    } );
                    scope.postList = postList;
                    scope.courseSearchModel.postId = !!stateParams.postId ? stateParams.postId * 1 : scope.postList[ 0 ].id;
                } );
                // business list
                businessService.getAllList().$promise.then( function( businessList ) {

                    scope.businessList = businessList;

                    var checkedList = [];
                    var businessIds = stateParams.businessIds;
                    if( !businessIds ) {
                        return;
                    }

                    // split id string
                    businessIds = businessIds.split( "," );
                    $.each( businessIds , function( index , id ) {

                        id *= 1;
                        $.each( businessList , function( _index , business ) {

                            id == business.id && checkedList.push( business );
                        } );
                    } );

                    scope.businessArray = checkedList;
                } );
            };
            /**
             * 处理搜索参数
             *
             * @param courseSearchModel
             * @param defineParams
             * @param queryParams
             * @returns {{defineParams: *, queryParams: *}}
             */
            var processSearchParams = function( courseSearchModel , defineParams , queryParams ) {

                // chapter
                if( !!courseSearchModel.chapterId && courseSearchModel.chapterId > 0 ) {
                    defineParams.chapterId = "@chapterId";
                    queryParams.chapterId = courseSearchModel.chapterId;
                }
                // section
                if( !!courseSearchModel.sectionId && courseSearchModel.sectionId > 0 ) {
                    defineParams.sectionId = "@sectionId";
                    queryParams.sectionId = courseSearchModel.sectionId;
                }
                // representation
                if( !!courseSearchModel.representationId && courseSearchModel.representationId > 0 ) {
                    defineParams.representationId = "@representationId";
                    queryParams.representationId = courseSearchModel.representationId;
                }
                // device
                if( !!courseSearchModel.deviceId && courseSearchModel.deviceId > 0 ) {
                    defineParams.deviceId = "@deviceId";
                    queryParams.deviceId = courseSearchModel.deviceId;
                }
                // post
                if( !!courseSearchModel.postId && courseSearchModel.postId > 0 ) {
                    defineParams.postId = "@postId";
                    queryParams.postId = courseSearchModel.postId;
                }
                // business
                if( !!courseSearchModel.businessIds ) {
                    defineParams.businessIds = "@businessIds";
                    queryParams.businessIds = courseSearchModel.businessIds;
                }
                // business
                if( !!courseSearchModel.businessId ) {
                    defineParams.businessId = "@businessId";
                    queryParams.businessId = courseSearchModel.businessId;
                }
                // course
                if( !!courseSearchModel.courseName ) {
                    defineParams.courseName = "@courseName";
                    queryParams.courseName = courseSearchModel.courseName;
                }
                if( !!courseSearchModel.lecturer ) {
                    defineParams.lecturer = "@lecturer";
                    queryParams.lecturer = courseSearchModel.lecturer;
                }
                // sort
                if( !!courseSearchModel.sort ) {
                    defineParams.sort = "@sort";
                    queryParams.sort = courseSearchModel.sort;
                }

                return {
                     "defineParams": defineParams
                    ,"queryParams" : queryParams
                };
            };
            /**
             * 返回搜索结果
             *
             * @private
             */
            this.search = function( stateParams ) {

                var courseQueryModel = {};
                if( !!stateParams.chapterId && stateParams.chapterId > 0 ) {
                    courseQueryModel.chapterId = stateParams.chapterId * 1;
                }
                if( !!stateParams.sectionId && stateParams.sectionId > 0 ) {
                    courseQueryModel.sectionId = stateParams.sectionId * 1;
                }
                if( !!stateParams.deviceId && stateParams.deviceId > 0 ) {
                    courseQueryModel.deviceId = stateParams.deviceId * 1;
                }
                if( !!stateParams.representationId && stateParams.representationId > 0 ) {
                    courseQueryModel.representationId = stateParams.representationId * 1;
                }
                if( !!stateParams.postId && stateParams.postId > 0 ) {
                    courseQueryModel.postId = stateParams.postId * 1;
                }
                if( !!stateParams.businessIds ) {
                    courseQueryModel.businessIds = stateParams.businessIds;
                }
                if( !!stateParams.businessId ) {
                    courseQueryModel.businessId = stateParams.businessId;
                }
                if( !!stateParams.sort ) {
                    courseQueryModel.sort = stateParams.sort;
                }
                if( !!stateParams.courseName ) {
                    courseQueryModel.courseName = stateParams.courseName;
                }
                if( !!stateParams.lecturer ) {
                    courseQueryModel.lecturer = stateParams.lecturer;
                }

                var params = processSearchParams( courseQueryModel , {} , {} );

                return $resource( "/api/course/search" , params.defineParams ).query( params.queryParams );
            };
            /**
             * 处理搜索参数并跳转搜索结果页
             *
             * @param courseSearchModel
             */
            this.goSearchPage = function( courseSearchModel ) {

                var params = processSearchParams( courseSearchModel , {} , {} );

                $state.go( "course.search" , params.queryParams , {
                     "inherit": false
                    ,"reload" : true
                } );
            };
} ] );

/**
 * question bank
 */
app.service(
     "questionBankService"
    ,[
         "$resource"
        ,"$state"
        ,"chapterService"
        ,"sectionService"
        ,"deviceService"
        ,"postService"
        ,"businessService"
        ,function(
             $resource
            ,$state
            ,chapterService
            ,sectionService
            ,deviceService
            ,postService
            ,businessService
        ) {

            /**
             * 获取题目相关数据
             *
             * @param scope
             * @param stateParams
             */
            this.getDataOfQuestionBankAbout = function( scope ) {

                // define search model
                if( !scope.questionBankModel ) {
                    scope.questionBankModel = {
                        difficult:3,
                    };
                }

                // chapter list
                chapterService.getAllList().$promise.then( function( chapterList ) {

                    chapterList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择章"
                        ,"remark": "请选择章"
                    } );
                    scope.chapterList = chapterList;
                    if( !scope.questionBankModel.chapter ) {
                        scope.questionBankModel.chapter = {};
                        scope.questionBankModel.chapter.id = scope.chapterList[ 0 ].id;
                    }
                } );
                // section list
                sectionService.getAllList().$promise.then( function( sectionList ) {

                    sectionList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择节"
                        ,"remark": "请选择节"
                    } );
                    scope.sectionList = sectionList;
                    if( !scope.questionBankModel.section ) {
                        scope.questionBankModel.section = {};
                        scope.questionBankModel.section.id = scope.sectionList[ 0 ].id;
                    }
                } );
                // device list
                deviceService.getAllList().$promise.then( function( deviceList ) {

                    deviceList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择设备"
                        ,"remark": "请选择设备"
                    } );
                    scope.deviceList = deviceList;
                    if( !scope.questionBankModel.device ) {
                        scope.questionBankModel.device = {};
                        scope.questionBankModel.device.id = scope.deviceList[ 0 ].id;
                    }
                } );
                // post list
                postService.getAllList().$promise.then( function( postList ) {

                    postList.unshift( {
                         "id"    : -1
                        ,"name"  : "请选择岗位"
                        ,"remark": "请选择岗位"
                    } );
                    scope.postList = postList;
                    if( !scope.questionBankModel.post ) {
                        scope.questionBankModel.post = {};
                        scope.questionBankModel.post.id = scope.postList[ 0 ].id;
                    }
                } );
                // business list
                businessService.getAllList().$promise.then( function( businessList ) {

                    scope.businessList = businessList;
                    scope.businessArray = [];

                    var checkedList = [];
                    var businesses = scope.questionBankModel.businesses;
                    if( !businesses ) {
                        return;
                    }

                    var businessIds = [];
                    businesses.map( function( business ) {

                        businessIds.push( business.id );
                        return business;
                    } );
                    $.each( businessIds , function( index , id ) {

                        $.each( businessList , function( _index , business ) {

                            id == business.id && checkedList.push( business );
                        } );
                    } );

                    scope.businessArray = checkedList;
                } );
            };

            /**
             * submit the form data.
             *
             * @param questionBankModel question bank model quote
             */
            this.saveQuestionBank = function( questionBankModel ) {

                var tips = "{operator}成功！";
                tips = tips.replace(/\{operator\}/, !!questionBankModel.id ? "修改" : "添加");

                return !!questionBankModel && $resource( "/api/question-bank/:id", {id:'@id'} ).save( questionBankModel , function() {

                    bootbox.alert( tips , function() {

                        $state.go( "question-bank" );
                    } );
                } );
            };



            /**
             * find all list of question bank
             */
            this.getAllList = function() {

                return $resource( "/api/question-bank/all" ).query();
            };

            /**
             * find a question bank data by id
             *
             * @param id
             */
            this.getQuestionBankById = function( id ) {

                return $resource( "/api/question-bank/:id" , {
                    "id": "@id"
                } ).get( {
                    "id": id
                } );
            };

            this.deleteQuestionById = function(id){
                return $resource("/api/question-bank/:id", {id:id}).delete();
            };
        }
    ]
);

/**
 * examination
 */
app.service( "examinationService" , [
     "$resource"
    ,"$state"
    ,"chapterService"
    ,"sectionService"
    ,"deviceService"
    ,"postService"
    ,"businessService"
    ,"baseURL"
    ,function(
        $resource
        ,$state
        ,chapterService
        ,sectionService
        ,deviceService
        ,postService
        ,businessService
        ,baseURL
    ) {

        this.answerExaminationById = function(id, answer){
            return $resource(baseURL + '/api/examinations/:id/answer', {id:id}).save(answer);
        }

        this.getExaminationById = function(id){
            return $resource(baseURL + '/api/examinations/:id').get({id:id});
        };

        this.deleteExaminationById = function(id){
            return $resource(baseURL + '/api/examinations/:id', {id:id}).delete();
        }

        this.getAllExaminations = function(){
            return $resource(baseURL + '/api/examinations').query();
        };

        this.getMyExaminations = function(){
            return $resource(baseURL + '/api/examinations/my').query();
        }

        /**
         * 创建 datetimepicker
         */
        this.createDatetimePicker = function() {
            $( "#startDate, #endDate" ).datetimepicker( {
                 "format"        : "yyyy-mm-dd"
                ,"autoclose"     : true
                ,"todayBtn"      : "linked"
                ,"language"      : "zh-CN"
                ,"minView"       : "month"
                ,"pickerPosition": "bottom-left"
            } );
        };

        /**
         * 获取题目相关数据
         *
         * @param scope
         * @param stateParams
         */
        this.getDataOfQuestionBankAbout = function( scope ) {

            // define search model
            if( !scope.questionBankModel ) {
                scope.questionBankModel = {};
            }

            // chapter list
            chapterService.getAllList().$promise.then( function( chapterList ) {

                chapterList.unshift( {
                    "id"    : -1
                    ,"name"  : "请选择章"
                    ,"remark": "请选择章"
                } );
                scope.chapterList = chapterList;
                if( !scope.questionBankModel.chapter ) {
                    scope.questionBankModel.chapter = {};
                    scope.questionBankModel.chapterId = scope.chapterList[ 0 ].id;
                }

            } );
            // section list
            sectionService.getAllList().$promise.then( function( sectionList ) {

                sectionList.unshift( {
                    "id"    : -1
                    ,"name"  : "请选择节"
                    ,"remark": "请选择节"
                } );
                scope.sectionList = sectionList;
                if( !scope.questionBankModel.section ) {
                    scope.questionBankModel.section = {};
                    scope.questionBankModel.sectionId = scope.sectionList[ 0 ].id;
                }
            } );
            // device list
            deviceService.getAllList().$promise.then( function( deviceList ) {

                deviceList.unshift( {
                    "id"    : -1
                    ,"name"  : "请选择设备"
                    ,"remark": "请选择设备"
                } );
                scope.deviceList = deviceList;
                if( !scope.questionBankModel.device ) {
                    scope.questionBankModel.device = {};
                    scope.questionBankModel.deviceId = scope.deviceList[ 0 ].id;
                }
            } );
            // post list
            postService.getAllList().$promise.then( function( postList ) {

                postList.unshift( {
                    "id"    : -1
                    ,"name"  : "请选择岗位"
                    ,"remark": "请选择岗位"
                } );
                scope.postList = postList;
                if( !scope.questionBankModel.post ) {
                    scope.questionBankModel.post = {};
                    scope.questionBankModel.postId = scope.postList[ 0 ].id;
                }
            } );
            // business list
            businessService.getAllList().$promise.then( function( businessList ) {

                scope.businessList = businessList;
                scope.businessArray = [];

                var checkedList = [];
                var businesses = scope.questionBankModel.businesses;
                if( !businesses ) {
                    return;
                }

                var businessIds = [];
                businesses.map( function( business ) {

                    businessIds.push( business.id );
                    return business;
                } );
                $.each( businessIds , function( index , id ) {

                    $.each( businessList , function( _index , business ) {

                        id == business.id && checkedList.push( business );
                    } );
                } );

                scope.businessArray = checkedList;
            } );
        };

        this.createExaminationWithModel = function(model){
            return $resource(baseURL+'/api/examinations').save(model);
        };
    }
] );

/**
 * comment
 */
app.service( "commentService" , [ "$resource" , "$state" , function( $resource ) {

    /**
     * find all list of comment by course id.
     *
     * @param courseId
     */
    this.getAllListByCourse = function( courseId ) {

        return $resource( "/api/comment/list/:courseId" , {
            "courseId": "@courseId"
        } ).query( {
            "courseId": courseId
        } );
    };

    /**
     * submit the comment form data to save.
     *
     * @param commentModel
     */
    this.save = function( commentModel ) {

        return !!commentModel && $resource( "/api/comment" ).save( commentModel ).$promise;
    };
} ] );

/**
 * device
 */
app.service( "deviceService" , [ "$resource" , "$state" , 'baseURL', function( $resource , $state ,baseURL) {

    /**
     * find all list of device
     */
    this.getAllList = function() {

        return $resource( "/api/device/all" ).query();
    };

    /**
     * find one device model data by id
     *
     * @param id
     */
    this.getDeviceById = function( id ) {

        return $resource( "/api/device/:id" , {
            "id": "@id"
        } ).get( {
            "id": id
        } );
    };

    this.deleteDeviceById = function(id){
        return $resource(baseURL + '/api/devices/:id',{id:id}).delete();
    };

    /**
     * submit the form data.
     *
     * @param deviceModel device model quote
     */
    this.saveOrUpdate = function( deviceModel ) {

        var tips = "{operator}成功！";
        tips = javask.string.replaceAll( tips , "{operator}" , !!deviceModel.id ? "修改" : "添加" );

        return !!deviceModel && $resource( "/api/device/:id" ).save( deviceModel , function() {

            bootbox.alert( tips , function() {

                    $state.go( "device" );
                }
            );
        } );
    };

    this.getAllDevicesName = function(){
        return $resource(baseURL + '/api/devices').query();
    };
} ] );

/**
 * post
 */
app.service( "postService" , [ "baseURL" , "$resource" , "$state" , function( baseURL , $resource , $state ) {

    /**
     * find all list of post
     */
    this.getAllList = function() {

        return $resource( baseURL + "/api/post/all" ).query();
    };

    /**
     * find a post model data by id.
     *
     * @param id
     */
    this.getPostById = function( id ) {

        return $resource( baseURL + "/api/post/:id" , {
            "id": "@id"
        } ).get( {
            "id": id
        } );
    };

    this.deletePostById = function(id){
        return $resource(baseURL + '/api/posts/:id', {id:id}).delete();
    };

    /**
     * submit the form data.
     *
     * @param postModel post model data.
     */
    this.saveOrUpdate = function( postModel ) {

        var tips = "{operator}成功！";
        tips = javask.string.replaceAll( tips , "{operator}" , !!postModel.id ? "修改" : "添加" );

        return !!postModel && $resource( "/api/post/:id" ).save( postModel , function() {

            bootbox.alert( tips , function() {

                    $state.go( "post" );
                }
            );
        } );
    };

    this.getAllPostsName = function(){
        return $resource(baseURL + '/api/posts').query();
    };
} ] );

/**
 * representation
 */
app.service( "representationService" , [ "baseURL" , "$resource" , "$state" , function( baseURL , $resource , $state ) {

    /**
     * find all list of representation
     */
    this.getAllList = function() {

        return $resource( baseURL + "/api/representation/all" ).query();
    };

    /**
     * find a representation model data by id.
     *
     * @param id
     */
    this.getRepresentationById = function( id ) {

        return $resource( baseURL + "/api/representation/:id" , {
            "id": "@id"
        } ).get( {
            "id": id
        } );
    };

    this.deleteRepresentaionById = function(id){
        return $resource(baseURL + '/api/representations/:id', {id:id}).delete();
    };

    /**
     * submit the form data.
     *
     * @param representationModel representation model data.
     */
    this.saveOrUpdate = function( representationModel ) {

        var tips = "{operator}成功！";
        tips = javask.string.replaceAll( tips , "{operator}" , !!representationModel.id ? "修改" : "添加" );

        return !!representationModel && $resource( "/api/representation/:id" ).save( representationModel , function() {

                bootbox.alert( tips , function() {

                        $state.go( "representation" );
                    }
                );
            } );
    };
} ] );

/**
 * business
 */
app.service( "businessService" , [ "baseURL" , "$resource" , "$state" , function( baseURL , $resource , $state ) {

    /**
     * find all list of business
     */
    this.getAllList = function() {

        return $resource( baseURL + "/api/business/all" ).query();
    };

    /**
     * find a business model data by id.
     *
     * @param id
     */
    this.getBusinessById = function( id ) {

        return $resource( baseURL + "/api/business/:id" , {
            "id": "@id"
        } ).get( {
            "id": id
        } );
    };

    this.deleteBusinessById = function(id){
        return $resource(baseURL + '/api/businesses/:id', {id:id}).delete();
    }

    /**
     * submit the form data.
     *
     * @param businessModel business model data.
     */
    this.saveOrUpdate = function( businessModel ) {

        var tips = "{operator}成功！";
        tips = javask.string.replaceAll( tips , "{operator}" , !!businessModel.id ? "修改" : "添加" );

        return !!businessModel && $resource( "/api/business/:id" ).save( businessModel , function() {

                bootbox.alert( tips , function() {

                        $state.go( "business" );
                    }
                );
            } );
    };

    this.getAllBusinessesName = function(){
        return $resource(baseURL + '/api/businesses').query();
    };

} ] );

/**
 * chapter
 */
app.service( "chapterService" , [ "baseURL" , "$resource" , "$state" , function( baseURL , $resource , $state ) {

    /**
     * find all list of chapter
     */
    this.getAllList = function() {

        return $resource( baseURL + "/api/chapter/all" ).query();
    };

    /**
     * find a chapter model data by id.
     *
     * @param id
     */
    this.getChapterById = function( id ) {

        return $resource( baseURL + "/api/chapter/:id" , {
            "id": "@id"
        } ).get( {
            "id": id
        } );
    };

    /**
     * submit the form data.
     *
     * @param chapterModel chapter model data.
     */
    this.saveOrUpdate = function( chapterModel ) {

        var tips = "{operator}成功！";
        tips = javask.string.replaceAll( tips , "{operator}" , !!chapterModel.id ? "修改" : "添加" );

        return !!chapterModel && $resource( "/api/chapter/:id" ).save( chapterModel , function() {

                bootbox.alert( tips , function() {

                        $state.go( "chapter" );
                    }
                );
            } );
    };
} ] );

/**
 * section
 */
app.service( "sectionService" , [ "baseURL" , "$resource" , "$state" , function( baseURL , $resource , $state ) {

    /**
     * find all list of section
     */
    this.getAllList = function() {

        return $resource( baseURL + "/api/section/all" ).query();
    };

    /**
     * find a section model data by id.
     *
     * @param id
     */
    this.getSectionById = function( id ) {

        return $resource( baseURL + "/api/section/:id" , {
            "id": "@id"
        } ).get( {
            "id": id
        } );
    };

    /**
     * submit the form data.
     *
     * @param sectionModel section model data.
     */
    this.saveOrUpdate = function( sectionModel ) {

        var tips = "{operator}成功！";
        tips = javask.string.replaceAll( tips , "{operator}" , !!sectionModel.id ? "修改" : "添加" );

        return !!sectionModel && $resource( "/api/section/:id" ).save( sectionModel , function() {

                bootbox.alert( tips , function() {

                        $state.go( "section" );
                    }
                );
            } );
    };
} ] );

app.service('studentService', ['baseURL', '$resource', function(baseURL, $resource){

  this.getAllStudents = function(){
    return $resource(baseURL + '/students').query();
  }

  this.getAllProgress = function(){
    return $resource(baseURL + '/students/progress').query();
  };

  this.getStudiedById = function(id){
    return $resource(baseURL + '/students/:id/studied', {id:id}).query();
  };

  this.getProfileById = function(id){
    return  $resource(baseURL + '/students/:id/profile', {id:id}).get();
  };

  this.updateStudent = function(obj){
    return $resource(baseURL + '/students/:id', {id:'@id'}, {'put':{method:'PUT'}}).put(obj);
  };

  this.resetPasswordById = function(id){
    return $resource(baseURL + '/students/:id/password-initial', {id:id}, {'put':{method:'PUT'}}).put();
  };


}]);
app.service( "classService" ,['baseURL', '$resource', function(baseURL, $resource) {
  this.getAllClassesProgress = function(){
    return $resource(baseURL + '/classes/progress').query();
  };

  this.getClassById = function(id){
    return $resource(baseURL + '/classes/:id/detail', {id:id}).get();
  };
  this.createNewClass = function(body){
    return $resource(baseURL + '/classes').save(body);
  };
  this.finishClassById = function(id){
    return $resource(baseURL + '/classes/:id/finish', {id:id}, {'put':{Method:'PUT'}}).put();
  };
  this.deleteClassById = function(id){
    return $resource(baseURL + '/classes/:id', {id:id}).delete();
  };
}] );

app.service('accountService', ['baseURL', '$resource', '$state', '$rootScope', '$window', function(baseURL, $resource, $state, $rootScope, $window) {
  var self = this;

  //Authority
  var _authority;
  this.setAuthority = function(auth) {
    _authority = auth;
    $rootScope.$broadcast(AuthorityBroadcast);
  };
  var setAuthority = this.setAuthority;
  this.getAuthority = function() {
    return _authority;
  }

  var _profile;
  this.setProfile = function(p){
    _profile = p;
  };
  this.getProfile = function(){
    return _profile;
  }

  this.signupWithUser = function(user) {
    var rtn = $resource(baseURL + '/accounts/signup', {}, { post: { method: 'POST' } }).post(user);
    rtn.$promise.then(function(response) {
      if (response.success) {
        self.setAuthority(response.data.auth);
        self.setProfile(response.data.profile);
      }
    });
    return rtn;
  };

  this.signinWithUser = function(user) {
    var rtn = $resource(baseURL + '/accounts/signin', {}, { post: { method: 'POST' } }).post(user);
    rtn.$promise.then(function(response) {
      if (response.success) {
        self.setAuthority(response.data.auth);
        self.setProfile(response.data.profile);
        $state.go('app');
      }
    });
    return rtn;
  };

  this.logout = function(){
    $window.localStorage.setItem('name', '');
    $window.localStorage.setItem('password', '');
    self.setAuthority({});
    self.setProfile({});
    $resource(baseURL + '/accounts/logout').get().$promise.then(function(res){
        $state.go('app',{},{reload:true});
    });


  };


  this.getAllAccountsRoles = function(){
    return $resource(baseURL + '/accounts/withRoles').query();
  };

  this.getAllRoles = function(){
    return $resource(baseURL + '/accounts/roles').query();
  };

  this.addRoleToAccount = function(id, roles){
    return $resource(baseURL + '/accounts/:id/roles',{id:'@id'}).save({id:id, roles:roles});
  };

  this.getAllRolesWithAuthorities = function(){
    return $resource(baseURL + '/accounts/roles/authorities').query();
  };

  this.addAuthoritesForRole = function(id, authorities)
  {
    return $resource(baseURL + '/accounts/roles/:id/authorities', {id:'@id'}).save({id:id, authorities:authorities});
  };

  this.getAllAuthorities = function(){
    return $resource(baseURL + '/accounts/authorities').query();
  };

  this.deleteRolebyId = function(id){
    return $resource(baseURL + '/accounts/roles/:id', {id:id}).delete();
  };

  this.createRole = function(name, authorities){
    return $resource(baseURL + '/accounts/roles').save({name:name, authorities:authorities});
  };


  this.getProfileBySession = function(){
    return $resource(baseURL + '/accounts/profile').get();
  };

  this.getBasicProfileBySession = function(){
    return $resource(baseURL + '/accounts/profile/basic').get();
  };

  this.updateBasicProfile = function(data){
    return $resource(baseURL + '/accounts/profile/basic', null, {'update':{method:'PUT'}}).update(data)
  };

  this.readNotificationById = function(id){
    return $resource(baseURL + '/accounts/notifications/:id', {id,id}, {'update':{method:'PUT'}}).update();
  };

  this.deleteNotificationById = function(id){
    return $resource(baseURL + '/accounts/notifications/:id', {id,id}).delete();
  };

  // obj = {oldPassword:'', newPassword:'', email:''}
  this.updatePassword = function(obj){
    return $resource(baseURL + '/accounts/password', null, {'put':{method:'PUT'}}).put(obj);
  };

}]);

app.service('systemService', ['baseURL', '$resource', function(baseURL, $resource) {
  this.createBackup = function(){
    return $resource(baseURL + '/system/backups').save();
  };
  this.getBackupList = function(){
    return $resource(baseURL + '/system/backups').query();
  };
  this.restoreBackup = function(filename){
    return $resource(baseURL + '/system/restore/:filename', {filename:filename}).save();
  };
  this.removeBackup = function(filename){
    return $resource(baseURL + '/system/backups/:filename', {filename:filename}).delete();
  };
}]);

app.service("configurationService", [ "baseURL", '$resource', function( baseURL, $resource){
    this.uploadCarouselTitle = function(obj){
        return $resource(baseURL + '/api/carousel-titles/').save(obj);
    };

    this.getAllCarousels = function(){
        return $resource(baseURL + '/api/carousel-titles/').query();
    };

    this.deleteCarouselById = function(id){
        return $resource(baseURL + '/api/carousel-titles/:id', {id: id}).delete();
    };

    this.uploadNews = function(obj){
        return $resource(baseURL + '/api/news/').save(obj);
    };

    this.updateNews = function(obj){
        return $resource(baseURL + '/api/news/:id', {id:'@id'}, {'put': {method:'PUT'}}).put(obj);
    };

    this.getAllNews = function(){
        return $resource(baseURL + '/api/news/').query();
    };

    this.deleteNewsById = function(id){
        return $resource(baseURL + '/api/news/:id', {id: id}).delete();
    };

    this.getNewsById = function(id){
        return $resource(baseURL + '/api/news/:id', {id: id}).get();
    };

    this.uploadEvent = function(evt){
        return $resource(baseURL + '/api/events/').save(evt);
    };

    this.updateEvent = function(evt){
        return $resource(baseURL + '/api/events/:id', {id:'@id'}, {'put': {method:'PUT'}}).put(evt);
    };

    this.getAllEvents = function(){
        return $resource(baseURL + '/api/events/').query();
    };

    this.deleteEventById = function(id){
        return $resource(baseURL + '/api/events/:id', {id:id}).delete();
    };
    
    this.getAllFavorites = function(){
        return $resource(baseURL + '/api/favorites').query();
    };

    this.upsertFavorite = function(favorite){
        return favorite.id
                    ? $resource(baseURL + '/api/favorites/:id', {id:'@id'}, {put:{method:'PUT'}}).put(favorite)
                    : $resource(baseURL + '/api/favorites').save(favorite);
    };


    this.getAllFaqs = function(){
        return $resource(baseURL + '/api/faqs').query();
    };

    this.upsertFaq = function(faq){
        return faq.id
                    ? $resource(baseURL + '/api/faqs/:id', {id:'@id'}, {put:{method:'PUT'}}).put(faq)
                    : $resource(baseURL + '/api/faqs').save(faq);
    };

    this.deleteFaqById = function(id){
        return $resource(baseURL + '/api/faqs/:id', {id:id}).delete();
    };

    this.createNotificationForStudents = function(obj){
        return $resource(baseURL + '/accounts/notifications').save(obj);
    };

}]);

app.service( "courseListService" , function() {
});

