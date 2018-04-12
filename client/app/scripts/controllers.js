"user strict";

angular.module( "ngedu" )
    .controller('IndexController', [function() {

    }])

    .controller('FAQController', ['$scope', 'configurationService', function($scope, configurationService) {
        $scope.faqs = configurationService.getAllFaqs();
    }])

    .controller('ResetPasswordController', ['$scope', 'accountService', function($scope, accountService) {
        $scope.updatePassword = function(){
            if($scope.newPassword != $scope.newPasswordBkp)
            {
                bootbox.alert('两次新密码输入不一致。');
            }
            accountService.updatePassword({
                email:accountService.getProfile().email,
                oldPassword:$scope.oldPassword,
                newPassword:$scope.newPassword
            })
            .$promise
            .then(function(res){
                if(res.success){
                    bootbox.alert(res.msg, function(){
                        accountService.logout();
                    })
                }
                else{
                    bootbox.alert(res.msg)
                }
            });

        };

    }])
    .controller('HeaderController', ['$scope', 'accountService', "deviceService", "postService", "businessService", '$window', function($scope, accountService, deviceService, postService, businessService, $window) {
        $scope.authority = accountService.getAuthority();
        $scope.profile = accountService.getProfile();
        $scope.$on(AuthorityBroadcast, function(data){
          $scope.authority = accountService.getAuthority();
        });

        $scope.logout = function(){
          accountService.logout();
        };
        /* ======= Twitter Bootstrap hover dropdown ======= */

        // apply dropdownHover to all elements with the data-hover="dropdown" attribute
        // noinspection JSUnresolvedFunction
        $('[data-hover="dropdown"]').dropdownHover();

        /* Nested Sub-Menus mobile fix */

        $scope.updateClubAccount = function(){
            if($scope.profile)
            {
                $scope.clubName = $window.localStorage.getItem('name');
                $scope.clubPassword = $window.localStorage.getItem('password');
            }
        }

        $('li.dropdown-submenu > a.trigger').on('click', function(e) {
            var current = $(this).next();
            current.toggle();
            e.stopPropagation();
            e.preventDefault();
            if (current.is(':visible')) {
                $(this).closest('li.dropdown-submenu').siblings().find('ul.dropdown-menu').hide();
            }

        });
        
        // find menu list(device,post,business)
        $scope.deviceList = deviceService.getAllList();
        $scope.postList = postService.getAllList();
        $scope.businessList = businessService.getAllList();
    }])
    .controller( "ContentController" , [ "$scope" , "deviceService" , "$state", 'configurationService', '$timeout', 'courseService', function( $scope , deviceService , $state, configurationService, $timeout, courseService) {

        /* ======= Flexslider ======= */


        $scope.carousels = configurationService.getAllCarousels();

        $scope.carousels
            .$promise
            .then(function(){
                $timeout(function(){
                    $( ".flexslider" ).flexslider( {
                        animation: "fade"
                    } );

                },1)
            });

        // course search
        deviceService.getAllList().$promise.then( function( deviceList ) {

            deviceList.unshift( {
                 "id"    : -1
                ,"name"  : "请选择课程分类"
                ,"remark": "请选择课程分类"
            } );
            $scope.deviceList = deviceList;
            $scope.courseSearchModel = {};
            $scope.courseSearchModel.deviceId = $scope.deviceList[ 0 ].id;
        } );
        $scope.search = function( courseSearchModel ) {
            $state.go('course.search',courseSearchModel);
            console.log( courseSearchModel );
        };

        configurationService.getAllNews()
            .$promise
            .then(function(news){
                $scope.newsGroup = [];
                var innerArray = []; 
                var i = 0;
                for(i=0; i<news.length; i++)
                {
                     innerArray.push(news[i]);
                    if(i%3===2 && i!==0)
                    {
                        $scope.newsGroup.push( innerArray);
                        innerArray = [];
                    }
                }
                if(i%3!==0){
                    $scope.newsGroup.push(innerArray);
                };
                console.log($scope.newsGroup);
                $timeout(function(){
                    $('#news-carousel').carousel({ interval: false });
                },10);
            })


        $scope.events = configurationService.getAllEvents();

        $scope.favorites = configurationService.getAllFavorites();

        $scope.lastThreeMP4Course = courseService.getLastThreeMP4Courses();
        $scope.lastThreeMP4Course
            .$promise
            .then(function(){
                $timeout(function(){
                    // $('#videos-carousel').carousel({ interval: false });
                },100)
            })

    } ] )
   /*----------  login register reset  ----------*/
    .controller('SignUpController', ['$scope', 'accountService','$state', '$window', function($scope, accountService, $state, $window) {
        $scope.postForm = function(user){
            $window.localStorage.setItem('name', user.name);
            $window.localStorage.setItem('password', user.password);

            accountService.signupWithUser(user).$promise.then(function(data){
                bootbox.alert(data.msg, function(){
                    if(data.success)
                    {
                        $state.go('app');
                    }
                });
            }).catch(function(err){
            });
        };
    }])
    .controller('SignInController', ['$scope', 'accountService','$window', function($scope, accountService, $window) {
        $scope.postForm = function(user){
            $window.localStorage.setItem('name', user.name);
            $window.localStorage.setItem('password', user.password);
            accountService.signinWithUser(user).$promise.then(function(data){
                if(!data.success)
                {
                    bootbox.alert(data.msg);
                }

            }).catch(function(err){
                
            });
        };

    }])
    // student info
    .controller('StudentsController', ['$scope', 'studentService', function($scope, studentService) {
        $scope.Math = window.Math;
        var originProgress = studentService.getAllProgress();
        originProgress = studentService.getAllProgress();
        originProgress.$promise.then(function(data) {
            $scope.originStudents = data;
            $scope.itemsPerPage = 5;
            $scope.totalItems = originProgress.length;
            $scope.pageChanged(1);
        });
        $scope.pagination = {
            current: 1
        };
        $scope.pageChanged = function(newPage) {
            $scope.progress = originProgress.slice((newPage - 1) * $scope.itemsPerPage, newPage * $scope.itemsPerPage);
        };

    }])
    // studied course 
    .controller("StudiedController", ['$scope', 'studentService', '$stateParams', function($scope, studentService, $stateParams) {

        $scope.Math = window.Math;
        var originData = studentService.getStudiedById($stateParams.id);
        $scope.pagination = {
            current: 1
        };
        originData.$promise.then(function(data) {
            $scope.originCourses = data;
            $scope.itemsPerPage = 2;
            $scope.totalItems = originData.length;
            $scope.pageChanged(1);
        });

        $scope.pageChanged = function(newPage) {
            $scope.studied = originData.slice((newPage - 1) * $scope.itemsPerPage, newPage * $scope.itemsPerPage);
        };

    }])
    .controller('ProfileController', ['$scope', 'studentService', '$stateParams', function($scope, studentService, $stateParams) {
        $scope.tDate = new Date();
        var originData = studentService.getProfileById($stateParams.id);

        $scope.pagination = {
            current: 1
        };
        originData.$promise.then(function() {
            $scope.stu = originData;
            $scope.itemsPerPage = 5;
            $scope.totalItems = originData.courses.length;
            $scope.pageChanged(1);
        });

        $scope.pageChanged = function(newPage) {
            $scope.courses= originData.courses.slice((newPage - 1) * $scope.itemsPerPage, newPage * $scope.itemsPerPage);
        };

    }])
    // classes
    .controller('ClassesController', ['$scope', 'classService', '$state', function($scope, classService, $state) {
        
        $scope.classes = classService.getAllClassesProgress();


        $scope.finishClass = function(cls){
            classService.finishClassById(cls.id)
                .$promise
                .then(function(res){
                    if(res.success)
                    {
                        $state.reload();
                    }
                    bootbox.alert(res.msg);
                })
        };


        $scope.deleteClass = function(cls){
            classService.deleteClassById(cls.id)
                .$promise
                .then(function(res){
                    if(res.success)
                    {
                        $state.reload();
                    }
                    bootbox.alert(res.msg);
                })
        };

    }])
    // specify class
    .controller('ClassDetailController', ['$scope', 'classService', '$stateParams', function($scope, classService, $stateParams) {

        $scope.Math = window.Math;
        var originData = classService.getClassById($stateParams.id);
        var originAccounts;

        $scope.studentsPagination = { current: 1 };
        $scope.coursesPagination = { current: 1 };
        originData.$promise.then(function() {
            originAccounts= originData.accounts;
            $scope.originStudents = originData.accounts;
            $scope.originCourses = originData.courses;
            $scope.name = originData.name;

            //students
            $scope.itemsPerPage = 5;
            $scope.totalItems = originAccounts.length;
            $scope.pageChanged(1);

            //courses
            $scope.coursesPerPage = 2;
            $scope.totalCourses= $scope.originCourses.length;
            $scope.coursesPageChanged(1);

        });

        //students
        $scope.pageChanged = function(newPage) {
            $scope.students = originAccounts.slice((newPage - 1) * $scope.itemsPerPage, newPage * $scope.itemsPerPage);
        };

        //courses
        $scope.coursesPageChanged = function(newPage) {
            $scope.courses = $scope.originCourses.slice((newPage - 1) * $scope.coursesPerPage, newPage * $scope.coursesPerPage);
        };


    }])
    // add class
    .controller('ClassAddController', ['$scope', 'studentService', 'courseService', 'deviceService', 'postService', 'businessService', 'classService', '$state', function($scope, studentService, courseService, deviceService, postService, businessService, classService, $state){

        // get all data
        var students = studentService.getAllStudents().$promise.then(function(data){
            $scope.students = data;
            console.log(data);
        });
        var courses = courseService.getAllCourses().$promise.then(function(data){
            $scope.courses = data;
            console.log(data);
        });

        var devices = deviceService.getAllDevicesName().$promise.then(function(data){
            $scope.devices = data;
            console.log(data);
        });

        var posts = postService.getAllPostsName().$promise.then(function(data){
            $scope.posts = data;
            console.log(data);
        });

        var businesses = businessService.getAllBusinessesName().$promise.then(function(data){
            $scope.businesses = data;
            console.log(data);
        });


        // filter configuration
        $scope.selectedFilter = {isSelected:true};  // filter for all selected objects
        $scope.coursesFilter = {};
        $scope.$watch('filterPost', function(n){
            if(n == null || n.length == 0)
            {
                delete $scope.coursesFilter.post;
            }
            else{
                $scope.coursesFilter.post = n;
            }
        });
        $scope.$watch('devicePost', function(n) {
          if (n == null || n.length == 0) {
            delete $scope.coursesFilter.category;
          } else {
            $scope.coursesFilter.category = n;
          }
        });
        $scope.$watch('businessPost', function(n) {
          if (n == null || n.length == 0) {
            delete $scope.coursesFilter.business;
          } else {
            $scope.coursesFilter.business = n;
          }
        });

        $scope.createClass = function() {
          var studentIds = $scope.students
            .filter(function(student) {
              // filter all selectec students
              if (student.isSelected) return true;
            }).map(function(student) {
              // only use id
              return {id:student.id};
            });
          var coursesIds = $scope.courses
            .filter(function(course) {
              if (course.isSelected) return true;
            }).map(function(course) {
              return {id:course.id};
            });

          if(studentIds.length === 0 || coursesIds.length ===0)
          {
            bootbox.alert('学员或课程不能为空');
            return;
          }

          var submitObj = {
            className: $scope.className,
            studentIds: studentIds,
            courseIds: coursesIds
          }

          classService.createNewClass(submitObj).$promise.then(function (response) {
            console.log(response);
            if(response.success)
            {
                bootbox.alert(response.msg);
                $state.go('students.classes');
            }
          });

        };

        $scope.enrollToDate = new Date();
        $scope.enrollFromDate =  new Date(2002,11,29);
        // $scope.enrollFromDate.setMonth($scope.enrollFromDate.getMonth() - 2);



    }])
    /**********************************************************************************************************/
    // course list
    .controller( "CourseListController" , [ "$scope" , "courseService" , function( $scope , courseService ) {

        $scope.courseList = courseService.getAllList();
    } ] )
    // course search
    .controller( "CourseSearchController" , [ "$scope" , "$stateParams" , "courseService" , function( $scope , $stateParams , courseService ) {

        // 获取搜索条件相关数据
        courseService.getDataOfSearchAbout( $scope , $stateParams );
        // 根据查询参数进行查询
        $scope.courseList = courseService.search( $stateParams );
        /**
         * 搜索按钮事件
         *
         * @param courseSearchModel
         */
        $scope.search = function( courseSearchModel ) {

            courseSearchModel.businessIds = $scope.businessArray.map( function( business ) {
                return business.id;
            } ).join( "," );

            courseService.goSearchPage( courseSearchModel );
        };
    } ] )
    // course add
    .controller(
         "CourseAddController"
        ,[
             "$scope"
            ,"courseService"
            ,"chapterService"
            ,"sectionService"
            ,"deviceService"
            ,"postService"
            ,"businessService"
            ,"representationService"
            ,function(
                 $scope
                ,courseService
                ,chapterService
                ,sectionService
                ,deviceService
                ,postService
                ,businessService
                ,representationService
            ) {

                $scope.courseModel = {};

                // courseware
                courseService.createCoursewareUploadify( $scope );
                // thumbnail
                courseService.createThumbnailUploadify( $scope );

                // get all chapter list
                $scope.chapterList = chapterService.getAllList();
                // get all section list
                $scope.sectionList = sectionService.getAllList();
                // get all device list
                $scope.deviceList = deviceService.getAllList();
                // get all post list
                $scope.postList = postService.getAllList();
                // get all representation list
                $scope.representationList = representationService.getAllList();

                /**********************************************************************************************************/
                // get all business list
                $scope.businessList = businessService.getAllList();
                $scope.businessArray = [];
                /**********************************************************************************************************/

                $scope.doSave = function( courseModel ) {

                    // merge businessArray
                    courseModel[ "businesses" ] = $scope.businessArray;

                    console.log( courseModel );

                    $scope.courseForm.$dirty
                        && $scope.courseForm.$valid
                        && courseService.saveOrUpdate( courseModel )
                    ;
                };
            }
        ]
    )
    // course edit
    .controller(
         "CourseEditController"
        ,[
             "$scope"
            ,"courseService"
            ,"chapterService"
            ,"sectionService"
            ,"deviceService"
            ,"postService"
            ,"businessService"
            ,"representationService"
            ,"$state"
            ,"$stateParams"
            ,function(
                 $scope
                ,courseService
                ,chapterService
                ,sectionService
                ,deviceService
                ,postService
                ,businessService
                ,representationService
                ,$state
                ,$stateParams
            ) {


                // courseware
                courseService.createCoursewareUploadify( $scope );
                // thumbnail
                courseService.createThumbnailUploadify( $scope );

                // get all chapter list
                $scope.chapterList = chapterService.getAllList();
                // get all section list
                $scope.sectionList = sectionService.getAllList();
                // get all device list
                $scope.deviceList = deviceService.getAllList();
                // get all post list
                $scope.postList = postService.getAllList();
                // get all representation list
                $scope.representationList = representationService.getAllList();

                /**********************************************************************************************************/
                // get all business list
                $scope.businessList = businessService.getAllList();
                $scope.businessArray = [];
                /**********************************************************************************************************/

                if(!$stateParams.id)
                {
                    $scope.courseModel = {};
                }
                else{
                    $scope.courseModel = courseService.getCourseById($stateParams.id);
                    $scope.courseModel
                        .$promise
                        .then(function(){
                            var intersectionList = _.intersectionWith($scope.businessList, $scope.courseModel.businesses, function(a,b){return a.id === b.id});
                            intersectionList.forEach(function(e){
                                e.isSelected = true;

                            });
                        })
                }

                $scope.doSave = function( courseModel ) {

                    // merge businessArray
                    courseModel[ "businesses" ] = _.filter($scope.businessList, function(e){return e.isSelected});


                     $scope.courseForm.$valid
                        && courseService.saveOrUpdate( courseModel )
                    ;
                };
            }
        ]
    )
    /**********************************************************************************************************/
    // device list
    .controller( "DeviceListController", [ "$scope" , "deviceService" , '$state','$stateParams', function( $scope , deviceService , $state, $stateParams) {

        $scope.deviceList = deviceService.getAllList();


        $scope.deleteDevice = function(device){
            deviceService.deleteDeviceById(device.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg, function(){
                        if(res.success){$state.reload();}
                    });
                });

        }


    } ] )
    // device add
    .controller( "DeviceAddController" , [ "$scope" , "deviceService" , function( $scope , deviceService ) {

        $scope.doSave = function( deviceModel ) {

            deviceModel[ "sort" ] = deviceModel[ "sort" ] || 50000;

            $scope.deviceForm.$dirty
                && $scope.deviceForm.$valid
                && deviceService.saveOrUpdate( deviceModel )
            ;
        };
    } ] )
    // device edit
    .controller( "DeviceEditController" , [ "$scope" , "$stateParams" , "deviceService" , function( $scope , $stateParams , deviceService ) {

        // find by id
        $scope.deviceModel = deviceService.getDeviceById( $stateParams.id );

        $scope.doSave = function() {

            $scope.deviceForm.$dirty
                && $scope.deviceForm.$valid
                && deviceService.saveOrUpdate( $scope.deviceModel )
            ;
        };
    } ] )
    /**********************************************************************************************************/
    // chapter list
    .controller( "ChapterListController", [ "$scope" , "chapterService" , function( $scope , chapterService ) {

        $scope.chapterList = chapterService.getAllList();
    } ] )
    // chapter add
    .controller( "ChapterAddController" , [ "$scope" , "chapterService" , function( $scope , chapterService ) {

        $scope.doSave = function( chapterModel ) {

            chapterModel[ "sort" ] = chapterModel[ "sort" ] || 50000;

            $scope.chapterForm.$dirty
                && $scope.chapterForm.$valid
                && chapterService.saveOrUpdate( chapterModel )
            ;
        };
    } ] )
    // chapter edit
    .controller( "ChapterEditController" , [ "$scope" , "$stateParams" , "chapterService" , function( $scope , $stateParams , chapterService ) {

        // find by id
        $scope.chapterModel = chapterService.getChapterById( $stateParams.id );

        $scope.doSave = function() {

            $scope.chapterForm.$dirty
                && $scope.chapterForm.$valid
                && chapterService.saveOrUpdate( $scope.chapterModel )
            ;
        };
    } ] )
    /**********************************************************************************************************/
    // section list
    .controller( "SectionListController", [ "$scope" , "sectionService" , function( $scope , sectionService ) {

        $scope.sectionList = sectionService.getAllList();
    } ] )
    // section add
    .controller( "SectionAddController" , [ "$scope" , "sectionService" , function( $scope , sectionService ) {

        $scope.doSave = function( sectionModel ) {

            sectionModel[ "sort" ] = sectionModel[ "sort" ] || 50000;

            $scope.sectionForm.$dirty
            && $scope.sectionForm.$valid
            && sectionService.saveOrUpdate( sectionModel )
            ;
        };
    } ] )
    // section edit
    .controller( "SectionEditController" , [ "$scope" , "$stateParams" , "sectionService" , function( $scope , $stateParams , sectionService ) {

        // find by id
        $scope.sectionModel = sectionService.getSectionById( $stateParams.id );

        $scope.doSave = function() {

            $scope.sectionForm.$dirty
                && $scope.sectionForm.$valid
                && sectionService.saveOrUpdate( $scope.sectionModel )
            ;
        };
    } ] )
    /**********************************************************************************************************/
    // post list
    .controller( "PostListController" , [ "$scope" , "postService" , 'baseURL', '$state', function( $scope , postService , baseURL, $state) {

        $scope.postList = postService.getAllList();

        $scope.deletePost = function(post){
            postService.deletePostById(post.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg, function(){
                        if(res.success)
                        {
                            $state.reload();
                        }
                    })

                })
        };

    } ] )
    // post add
    .controller( "PostAddController" , [ "$scope" , "postService" , function( $scope , postService ) {

        $scope.doSave = function( postModel ) {

            postModel[ "sort" ] = postModel[ "sort" ] || 50000;

            $scope.postForm.$dirty
                && $scope.postForm.$valid
                && postService.saveOrUpdate( postModel )
            ;
        };
    } ] )
    // post edit
    .controller( "PostEditController" , [ "$scope" , "$stateParams" , "postService" , function( $scope , $stateParams , postService ) {

        // find by id
        $scope.postModel = postService.getPostById( $stateParams.id );

        $scope.doSave = function() {

            $scope.postModel[ "sort" ] = $scope.postModel[ "sort" ] || 50000;

            $scope.postForm.$dirty
                && $scope.postForm.$valid
                && postService.saveOrUpdate( $scope.postModel )
            ;
        };
    } ] )
    /**********************************************************************************************************/
    // representation list
    .controller( "RepresentationListController" , [ "$scope" , "representationService" , '$state', function( $scope , representationService ,$state) {

        $scope.representationList = representationService.getAllList();
        $scope.deleteRep = function(rep){
            representationService.deleteRepresentaionById(rep.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg, function(){
                        if(res.success){
                            $state.reload();
                        }
                    })

                })

        };
    } ] )
    // representation add
    .controller( "RepresentationAddController" , [ "$scope" , "representationService" , function( $scope , representationService ) {

        $scope.doSave = function( representationModel ) {

            representationModel[ "sort" ] = representationModel[ "sort" ] || 50000;

            $scope.representationForm.$dirty
                && $scope.representationForm.$valid
                && representationService.saveOrUpdate( representationModel )
            ;
        };
    } ] )
    // representation edit
    .controller( "RepresentationEditController" , [ "$scope" , "$stateParams" , "representationService" , function( $scope , $stateParams , representationService ) {

        // find by id
        $scope.representationModel = representationService.getRepresentationById( $stateParams.id );

        $scope.doSave = function() {

            $scope.representationModel[ "sort" ] = $scope.representationModel[ "sort" ] || 50000;

            $scope.representationForm.$dirty
                && $scope.representationForm.$valid
                && representationService.saveOrUpdate( $scope.representationModel )
            ;
        };
    } ] )
    /**********************************************************************************************************/
    // business list
    .controller( "BusinessListController" , [ "$scope" , "businessService" , 'baseURL', '$state', function( $scope , businessService, baseURL, $state) {

        $scope.businessList = businessService.getAllList();

        $scope.deleteBusiness = function(business)
        {
            businessService.deleteBusinessById(business.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg, function(){
                        if(res.success)
                        {
                            $state.reload();
                        }
                    });
                })
        }

    }])
    // business add
    .controller( "BusinessAddController" , [ "$scope" , "businessService" , function( $scope , businessService ) {

        $scope.doSave = function( businessModel ) {

            businessModel[ "sort" ] = businessModel[ "sort" ] || 50000;

            $scope.businessForm.$dirty
                && $scope.businessForm.$valid
                && businessService.saveOrUpdate( businessModel )
            ;
        };
    }])
    // business edit
    .controller( "BusinessEditController" , [ "$scope" , "$stateParams" , "businessService" , function( $scope , $stateParams , businessService ) {

        // find by id
        $scope.businessModel = businessService.getBusinessById( $stateParams.id );

        $scope.doSave = function() {

            $scope.businessModel[ "sort" ] = $scope.businessModel[ "sort" ] || 50000;

            $scope.businessForm.$dirty
                && $scope.businessForm.$valid
                && businessService.saveOrUpdate( $scope.businessModel )
            ;
        };
    }])
    /**********************************************************************************************************/
    // equipment training courses list controller
    .controller(
         "DeviceCourseListController"
        ,[
             "$scope"
            ,"$stateParams"
            ,"deviceService"
            ,"courseService"
            ,function( $scope , $stateParams , deviceService , courseService ) {

                $scope.courseList = courseService.search({deviceId:$stateParams.id});

                $scope.currentDevice = deviceService.getDeviceById( $stateParams.id );
                // $scope.courseList = courseService.getAllListByDevice( $stateParams.id );
                $scope.newCourseList = courseService.getNewListByDevice( $stateParams.id );
                $scope.playedMostDeviceCourses = courseService.getPlayedMostByQuery({deviceId:$stateParams.id});
            }
        ]
    )
    // post training courses list controller
    .controller(
         "PostCourseListController"
        ,[
             "$scope"
            ,"$stateParams"
            ,"postService"
            ,"courseService"
            ,function( $scope , $stateParams , postService , courseService ) {

                var postId = $stateParams.id;
                $scope.courseList = courseService.search({postId:$stateParams.id});
                $scope.currentPost = postService.getPostById( postId );
                // $scope.courseList = courseService.getAllListByPost( postId );
                $scope.newCourseList = courseService.getNewListByPost( postId );
                $scope.playedMostDeviceCourses = courseService.getPlayedMostByQuery({postId:postId});
            }
        ]
    )
    // business training courses list controller
    .controller(
         "BusinessCourseListController"
        ,[
             "$scope"
            ,"$stateParams"
            ,"businessService"
            ,"courseService"
            ,function( $scope , $stateParams , businessService , courseService ) {

                $scope.courseList = courseService.search({businessId:$stateParams.id});
                var businessId = $stateParams.id;
                $scope.currentBusiness = businessService.getBusinessById( businessId );
                // $scope.courseList = courseService.getAllListByBusiness( businessId );
                $scope.newCourseList = courseService.getNewListByBusiness( businessId );
                $scope.playedMostDeviceCourses = courseService.getPlayedMostByQuery({businessId:$stateParams.id});
            }
        ]
    )
    // detail of training info
    .controller(
         "TrainingDetailController"
        ,[
             "$scope"
            ,"$stateParams"
            ,"$interval"
            ,"courseService"
            ,"commentService"
            ,function( $scope , $stateParams , $interval , courseService , commentService ) {

                var courseId = $stateParams.id;
                $scope.currentCourse = courseService.getCourseById( courseId );

                $scope.currentCourse
                    .$promise
                    .then(function(res){
                        if(res.representation.name ==='zip'){
                            $('div.video').append('<embed  base="/upload/swf/'+res.courseware+'/" src="/upload/swf/'+res.courseware+'/index.swf" width="750px" height="562px">')
                        }
                        if(res.representation.name ==='pdf'){
                            $('div.video').append('<embed  src='+res.courseware+' width="100%" height="762px" type="application/pdf" >')
                        }
                    })

                // should move into service
                $scope.startStudy = function( event ) {

                    courseService.startStudy( event , $interval , courseId );
                };

                $scope.viewCourse = function(){
                    courseService.viewCourse($scope.currentCourse.id);
                };

                /**
                 * submit the comment form data to save.
                 *
                 * @param commentModel
                 */
                $scope.doSave = function( commentModel ) {

                    if( !commentModel ) {
                        bootbox.alert( "请填写评论内容后提交！" );
                        return;
                    }
                    commentModel.course = {};
                    commentModel.course.id = courseId;
                    commentService.save( commentModel ).then( function( result ) {

                        console.log( result );
                        if( result.success ) {
                            commentModel.content = "";
                            $scope.commentList.unshift( result.data );
                        }

                        bootbox.alert( result.message );
                    } );
                };

                $scope.commentList = commentService.getAllListByCourse( courseId );
            }
        ]
    )
    // detail of course with test example.
    .controller( "TrainingPlayerController" , [ function() {

        // 750 * 500
        var coursePlayIframe = $( "#coursePlay" );
        coursePlayIframe.on( "load" , function() {

            var _document = coursePlayIframe.contents();
            var _object   = _document.find( "#player" );
            var _embed    = _object.find( "embed" );

            _object.width( 750 );
            _object.height( 500 );
            _embed.width( 750 );
            _embed.height( 500 );
        } );
    } ] )
    /**********************************************************************************************************/
    // question bank list controller
    .controller( "QuestionBankListController" , [ "$scope" , "questionBankService" , function( $scope , questionBankService ) {

        $scope.questionBankList = questionBankService.getAllList();
    } ] )
    // question bank add controller
    .controller( "QuestionBankAddController" , [ "$scope" , "questionBankService" , function( $scope , questionBankService ) {


        $("#input-id").rating({showCaption:false});



        $scope.businessArray = [];
        // 获取题目相关数据
        questionBankService.getDataOfQuestionBankAbout( $scope );
        // 题目类型默认为选择题
        $scope.questionBankModel.type = "ChoiceQuestion";

        /**
         * 保存
         * @param questionBankModel
         */
        $scope.doSave = function( questionBankModel ) {
            questionBankModel.difficult = parseInt($('#input-id').val(), 10);

            questionBankModel.businesses = $scope.businessArray;

            if(questionBankModel.type === 'TrueOrFalseQuestion')
            {
                if(questionBankModel.trueOrFalse === true)
                {
                    questionBankModel.options=[{"name"   : "正确","isRight": true },{"name"   : "错误","isRight": false }];
                }
                else{questionBankModel.options=[{"name"   : "正确","isRight": false },{"name"   : "错误","isRight": true }];}
            }

            questionBankService.saveQuestionBank( questionBankModel );
        };

        /**************************************************************************
         * question bank option about.
         **************************************************************************/
        $scope.questionBankModel.options = [];
        /**
         * validation option data.
         *
         * @param optionModel
         */
        var validateOptionData = function( optionModel ) {

            if( !optionModel || !optionModel.name ) {
                bootbox.alert( "选项内容不能为空！" );
                return false;
            }
            return true;
        };
        /**
         * clear option model.
         */
        var clearModel = function() {
            $scope.optionModel = {};
        };
        /**
         * save option data.
         * @param optionModel
         */
        $scope.saveOption = function( optionModel ) {

            !!optionModel && !optionModel.index
                && validateOptionData( optionModel )
                && $scope.questionBankModel.options.push( optionModel )
            ;
            clearModel();
        };
        /**
         * edit option
         * @param optionModel
         */
        $scope.editOption = function( index , optionModel ) {

            optionModel.index = index;
            $scope.optionModel = optionModel;
        };
        /**
         * remove option.
         * @param optionModel
         */
        $scope.removeOption = function( index ) {

            $scope.questionBankModel.options.splice( index , 1 );
        };
    } ] )
    // question bank edit controller
    .controller( "QuestionBankEditController" , [ "$scope" , "$stateParams" , "questionBankService" , function( $scope , $stateParams , questionBankService ) {

        $("#input-id").rating({showCaption:false});

        $scope.logg =function(){
            console.log($scope.abc)
        }


        $scope.businessArray = [];
        // 获取题目相关数据
        questionBankService.getDataOfQuestionBankAbout( $scope );
        // 题目类型默认为选择题
        $scope.questionBankModel.type = "ChoiceQuestion";
        $scope.questionBankModel.options = [];

        if(!!$stateParams.id)//编辑
        {
            $scope.questionBankModel = questionBankService.getQuestionBankById($stateParams.id);
            $scope.questionBankModel.$promise.then(function(res){
                $('#input-id').rating('update', $scope.questionBankModel.difficult);


                if($scope.questionBankModel.type === 'TrueOrFalseQuestion')
                {
                    $scope.questionBankModel.options.forEach(function(e){
                        if(e.isRight)
                        {
                            $scope.questionBankModel.trueOrFalse = e.name==='正确'?true:false;
                        }

                    })

                }


                var intersectionArr = _.intersectionWith($scope.businessList, $scope.questionBankModel.businesses, (a, b)=>{return a.id === b.id});
                intersectionArr.forEach(function(e){
                    e.isSelected = true;
                })

            })

        }


        /**
         * 保存
         * @param questionBankModel
         */
        $scope.doSave = function( questionBankModel ) {
            questionBankModel.difficult = parseInt($('#input-id').val(), 10);

            questionBankModel.businesses = $scope.businessList.filter((e)=>{return !!e.isSelected});

            if(questionBankModel.type === 'TrueOrFalseQuestion')
            {
                if(questionBankModel.trueOrFalse === true)
                {
                    questionBankModel.options=[{"name"   : "正确","isRight": true },{"name"   : "错误","isRight": false }];
                }
                else{questionBankModel.options=[{"name"   : "正确","isRight": false },{"name"   : "错误","isRight": true }];}
            }

            questionBankService.saveQuestionBank( questionBankModel );
        };

        /**
         * validation option data.
         *
         * @param optionModel
         */
        var validateOptionData = function( optionModel ) {

            if( !optionModel || !optionModel.name ) {
                bootbox.alert( "选项内容不能为空！" );
                return false;
            }
            return true;
        };
        /**
         * clear option model.
         */
        var clearModel = function() {
            $scope.optionModel = {};
        };
        /**
         * save option data.
         * @param optionModel
         */
        $scope.saveOption = function( optionModel ) {

            !!optionModel 
            && optionModel.index===undefined
            && validateOptionData( optionModel )
            && $scope.questionBankModel.options.push( optionModel )
            ;
            clearModel();
        };
        /**
         * edit option
         * @param optionModel
         */
        $scope.editOption = function( index , optionModel ) {

            optionModel.index = index;
            $scope.optionModel = optionModel;
        };
        /**
         * remove option.
         * @param optionModel
         */
        $scope.removeOption = function( index ) {

            $scope.questionBankModel.options.splice( index , 1 );
        };

        $scope.removeAllOptions = function(){
            $scope.questionBankModel.options = [];
        }

    } ] )
    /**********************************************************************************************************/
    // examination list controller
    .controller( "ExaminationListController" , [ "$scope" , "examinationService" , '$state', '$stateParams', function( $scope , examinationService, $state , $stateParams) {
        $scope.type = $stateParams.type;
        $scope.getStudentsNameStrings = function(students){
            return students.map((s)=>{return s.realName;}).toString();
        };

        switch($scope.type)
        {
            case 'all':{
                $scope.examinationList = examinationService.getAllExaminations();
                break;
            }
            case 'my':{
                $scope.examinationList = examinationService.getMyExaminations();
                break;
            }
            default:{
                bootbox.alert('错误的访问类型。');
            }
        }


        $scope.isExpired = function(d){
            return new Date().toISOString() > d ;
        }

        $scope.goExaminationView = function(examination){
            $state.go('examination.view', {id:examination.id, type:'answer'});
        };

        $scope.deleteExamination = function(exam){
            examinationService.deleteExaminationById(exam.id)
                .$promise
                .then(function(res){
                    if(res.success)
                    {
                        $state.reload();
                    }
                });
        };
    } ] )
    // examination add controller
    .controller( "ExaminationAddController" , [ "$scope" , "examinationService" , "studentService", "questionBankService", '$state', function( $scope , examinationService , studentService, questionBankService, $state) {

        $scope.examinationModel = {};

        $scope.questions = questionBankService.getAllList();

        $scope.selectedFilter = {isSelected:true};

        var students = studentService.getAllStudents().$promise.then(function(data){
            $scope.students = data;
            console.log(data);
        });


        // create datetimepicker
        examinationService.createDatetimePicker();



        $scope.doSave = function(){
            this.examinationModel.students = this.students.filter((a)=>{return a.isSelected;}).map((a)=>{return a.id;});
            this.examinationModel.questions = this.questions.filter((a)=>{return a.isSelected;}).map((a)=>{return a.id;});

            if(this.examinationModel.students.length === 0 || this.examinationModel.questions.length ===0)
            {
                bootbox.alert('您尚未选择学员或题目。');
                return;
            }
            else
            {
                examinationService.createExaminationWithModel(this.examinationModel)
                .$promise.then(function(res){

                    bootbox.alert(res.msg,function(){
                        if(res.success)
                        {
                            $state.go('examination', {type:'all'})
                        }

                    });
                });
            }

        }

    } ] )
    // examination edit controller
    .controller( "ExaminationEditController" , [ "$scope" , "examinationService" , function( $scope , examinationService ) {

    } ] )
    .controller( "ExaminationViewController" , [ "$scope" , "examinationService" , '$stateParams', '$state', function( $scope , examinationService , $stateParams, $state) {
        $scope.type = $stateParams.type;
        $scope.random = function(a) {
            if(!a.randomValue) a.randomValue = Math.random();
            return a.randomValue;
        }

        $scope.examination = examinationService.getExaminationById($stateParams.id);

        $scope.submitAnswer = function(){
            $scope.examination.questionBanks.forEach(function(q,i,arr){
                if(q.type==='ChoiceQuestion' && q.isMultiSelect)
                {
                    q.answer = [];
                    q.options.forEach(function(se,i,arr){
                        if(se.isSelected)
                        {
                            q.answer.push(se.id);
                        }
                    })
                }
            })

            var submitObj = $scope.examination.questionBanks.map((e)=>{return {id:e.id, answer:e.answer}})

            examinationService.answerExaminationById($stateParams.id, submitObj)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg, function(){
                       if(res.success){$state.go("examination", {type:'my'})};
                    });
                });

        };

    } ] )
    .controller( "ExaminationResultController" , [ "$scope" , "examinationService" , "$stateParams", function( $scope , examinationService, $stateParams ) {
        $scope.examination = examinationService.getExaminationById($stateParams.id);

    } ] )
    /**********************************************************************************************************/
    /*----------  Authority controllers  ----------*/
    .controller("AssignRoleController", ['$scope', 'accountService', function($scope, accountService) {
      accountService.getAllAccountsRoles()
        .$promise
        .then(function(data) {
          $scope.accounts = data;
        });

      var _choosedAccount = {};

      accountService.getAllRoles().$promise.then(function(data) {
        $scope.optionList = data;
      });

      $scope.assignRole = function(account) {
        _choosedAccount = account;
        console.log(account);
        $('#assignRoleModal').modal('show');
        $scope.selectedList = account.roles;
      };

      $scope.submitRole = function(){
        accountService.addRoleToAccount(_choosedAccount.id, $scope.selectedList)
        .$promise
        .then(function(data){
            $('#assignRoleModal').modal('hide');
        });
      };
    }])
    .controller('EditRoleController', ['$scope', 'accountService', '$state', function($scope, accountService, $state) {
        var _role = {};
      $scope.itemsPerPage = 5;
      $scope.pagination = { current: 1 };

      var updatePageData = function() {
        accountService.getAllRolesWithAuthorities()
          .$promise
          .then(function(data) {
            $scope.roles = data;
          });
      };


      accountService.getAllAuthorities()
        .$promise
        .then(function(data) {
            $scope.optionList = data;
        });

      $scope.authoritiesToString = function(authorities) {
        return authorities.map(function(authority) {
          return authority.name;
        }).toString();
      };
      $scope.editRole = function(role){
        _role = role;
        $('#editRoleModal').modal('show');
        $scope.selectedList = JSON.parse(JSON.stringify(_role.authorities));
      };
      $scope.submitAuthority = function(){
        accountService.addAuthoritesForRole(_role.id, $scope.selectedList)
        .$promise
        .then(function(data){
            $('#editRoleModal').modal('hide');
            updatePageData();
        });
      };
      $scope.deleteRoleById = function(id){
        accountService.deleteRolebyId(id).$promise
        .then(function(data){
            console.log(data);
            // bootbox.alert(data.msg);
            updatePageData();
        });
      };

      $scope.showCreateRole = function(){
        $scope.selectedList = [];
        $('#createRoleModal').modal('show');
      };

      $scope.createRole = function(){
        accountService.createRole($scope.roleName, $scope.selectedList)
        .$promise
        .then(function(data){
            bootbox.alert(data.msg);
            $('#createRoleModal').modal('hide');
            updatePageData();
        })
      };
      updatePageData();
    }])

    .controller('BackupController', ['$scope', 'systemService', '$state', function($scope, systemService, $state) {
      systemService.getBackupList().$promise
        .then(function(data) {
          $scope.backups = data.map(function(element) {
            return {
              name: element,
              createdAt: moment(element, 'YYYYMMDD_HHmmss_SSS').toDate()
            };
          })
        });
      $scope.createBackup = function() {
        systemService.createBackup().$promise.then(function(response) {
          if (response.success) {
            $state.reload();
          }
        })
      }
    }])

    .controller('RestoreController', ['$scope', 'systemService', '$state', function($scope, systemService, $state) {
      systemService.getBackupList().$promise
        .then(function(data) {
          $scope.backups = data.map(function(element) {
            return {
              name: element,
              createdAt: moment(element, 'YYYYMMDD_HHmmss_SSS').toDate()
            };
          })
        });
      $scope.restoreBackup = function(filename) {
        systemService.restoreBackup(filename).$promise.then(function(response) {
          if (response.success) {
            $state.reload();
          }
        })
      };

      $scope.removeBackup = function(filename) {
        systemService.removeBackup(filename).$promise.then(function(response) {
          if (response.success) {
            $state.reload();
          };
        })
      }
    }])

    .controller('LoggingController', ['$scope', 'systemService', function($scope, systemService){
      var socket = io.connect('http://localhost:7000/logging');
      socket.on('logging updated', function(data) {
        console.log(data);
        var count = 0;
        $scope.logging = data.contents;
        $scope.$apply();
        var textarea = $('#logging');
        textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
      });
      $scope.$on('$destroy', function(){
        socket.disconnect();
      });
    }])

    .controller('SelfProfileController', ['$scope', 'accountService', function($scope, accountService){
        $scope.pagination = {
            current: 1
        };

        var  originData = accountService.getProfileBySession();

        var account = originData.$promise.then(function(){
            $scope.account = originData;
            $scope.itemsPerPage = 5;
            $scope.totalItems = originData.courses.length;
            $scope.pageChanged(1);
        });
        $scope.pageChanged = function(newPage) {
            $scope.courses= originData.courses.slice((newPage - 1) * $scope.itemsPerPage, newPage * $scope.itemsPerPage);
        };
    }])

    .controller('NotificationController', [ '$scope', '$stateParams', 'accountService', '$state', function($scope, $stateParams, accountService, $state){
        console.log($stateParams);
        $scope.notification = $stateParams.notification;

        accountService.readNotificationById($stateParams.id).$promise.then(function(data){
        $scope.notification = data.msg;
        $scope.notification.createdAt = data.msg.created_at;
        });

        $scope.deleteNotification = function(){
            accountService.deleteNotificationById($scope.notification.id);
            $state.go('app.account.profile');
        };

    }])

    .controller('ProfileEditController', ['$scope', 'businessService', 'accountService', '$state', function($scope, businessService, accountService, $state){
        $scope.account = accountService.getBasicProfileBySession();
        $scope.account.$promise.then(function(data){
            $scope.account.enrollTime = new Date(data.enrollTime);
        });

        $scope.allBusiness = businessService.getAllBusinessesName();
        $scope.selectedBusiness = '值守';

        $scope.updateProfile = function(){
            accountService.updateBasicProfile($scope.account).$promise.then(function(response){
                if(response.success)
                {
                    bootbox.alert(response.msg, function(){
                        $state.reload();
                    });
                }
                else{
                    bootbox.alert('更新失败!');
                }
            });
        };
    }])
    .controller('CarouselEditController', ['$scope', 'Upload', 'baseURL', 'configurationService', '$state', function($scope, Upload, baseURL, configurationService, $state){

        $scope.carousels = configurationService.getAllCarousels();
        $scope.newsList = configurationService.getAllNews();
        console.log($scope.carousels)
        console.log($scope.newsList)

        var Carousel = function(){
            this.title = "";
            this.subtitle = "";
            this.image = "";
            this.imagePath = "";
        };

        var News = function(){
            this.title = "";
            this.abstract = "";
            this.image = "";
            this.content = "";
        };

        $scope.carousel = new Carousel();
        $scope.news = new News();

        // upload on file select or drop
        $scope.upload = function (file) {
            if(!file){return;}
            Upload.upload({
                url: baseURL+'/file/carousels/',
                data: {carousel: file}
            }).then(function (resp) {
                $scope.carousel.image = resp.data.filename;
                $scope.carousel.imagePath ='/upload/carousel/' + resp.data.filename;
                console.log('Success: ' + 'uploaded. Response: ' + resp.data.filename);
            }, function (resp) {
                console.log('error status: ' + resp.data.msg);
            }, function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.uploadNewsImage = function(file){
            if(!file){return;}
            Upload.upload({
                url: baseURL+'/file/news-images/',
                data: {news: file}
            }).then(function (resp) {
                $scope.news.image = resp.data.filename;
                $scope.news.imagePath ='/upload/news/' + resp.data.filename;
                console.log('Success: ' + 'uploaded. Response: ' + resp.data.filename);
            }, function (resp) {
                console.log('error status: ' + resp.data.msg);
            }, function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };


        $scope.deleteCarousel = function(carousel){
            configurationService.deleteCarouselById(carousel.id)
                .$promise
                .then(function(res){
                    if(res.success){
                        $state.reload();
                    };
                });
        };

        $scope.submit = function(){
            configurationService.uploadCarouselTitle($scope.carousel)
                .$promise
                .then(function(res){
                    if(res.success)
                    {
                        $scope.carousel = new Carousel();
                        bootbox.alert(res.msg, function(){
                            $state.reload();
                        });
                    }
                })

        };

        $scope.submitNews = function(){
            configurationService.uploadNews($scope.news)
                .$promise
                .then(function(res){
                    if(res.success)
                    {
                        $scope.news = new News();
                        bootbox.alert(res.msg, function(){
                            $state.reload();
                        });
                    };
                })
        };

        $scope.editNews = function(){

        };

        $scope.deleteNews = function(news){
            console.log(news)
            configurationService.deleteNewsById(news.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg,function(){
                        if(res.success)
                        {
                            $state.reload();
                        }
                    });
                });
        };


    }])

    .controller('NewsListEditController', ['$scope', 'Upload', 'baseURL', 'configurationService', '$state', function($scope, Upload, baseURL, configurationService, $state){

        $scope.newsList = configurationService.getAllNews();
        console.log($scope.newsList)



        $scope.editNews = function(news){
            $state.go('app.management.news.edit',{id:news.id, type:'edit'});
        };

        $scope.deleteNews = function(news){
            console.log(news)
            configurationService.deleteNewsById(news.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg,function(){
                        if(res.success)
                        {
                            $state.reload();
                        }
                    });
                });
        };
    }])

    .controller('NewsEditController', ['$scope', 'Upload', 'baseURL', 'configurationService', '$state', '$stateParams', function($scope, Upload, baseURL, configurationService, $state, $stateParams){
        var News = function(){
            this.title = "";
            this.abstract = "";
            this.image = "";
            this.content = "";
        };

        $scope.type = $stateParams.type;

        switch($stateParams.type)
        {
            case 'create':{
                $scope.news = new News();
                $scope.title = '编辑';
                break;
            }
            case 'edit':{
                $scope.news = configurationService.getNewsById($stateParams.id);
                $scope.news.$promise.then(function(res){
                    console.log(res);
                })
                $scope.title = '新建';
                break;
            }
            default:{
                bootbox.alert('未知类型')
            }
        }


        $scope.uploadNewsImage = function(file){
            if(!file){return;}
            Upload.upload({
                url: baseURL+'/file/news-images/',
                data: {news: file}
            }).then(function (resp) {
                $scope.news.image = resp.data.filename;
                $scope.news.imagePath ='/upload/news/' + resp.data.filename;
                console.log('Success: ' + 'uploaded. Response: ' + resp.data.filename);
            }, function (resp) {
                console.log('error status: ' + resp.data.msg);
            }, function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        $scope.submitNews = function(){
            var rtnPromise = $stateParams.id 
                                ? configurationService.updateNews($scope.news)
                                : configurationService.uploadNews($scope.news)
            
            rtnPromise.$promise
                    .then(function(res){
                        if(res.success)
                        {
                            $scope.news = new News();
                            bootbox.alert(res.msg, function(){
                                $state.go('app.management.news');
                            });
                        };
                    })
        };
    }])

    .controller('NewsDetailController', ['$scope', 'baseURL', 'configurationService', '$state', '$stateParams', function($scope, baseURL, configurationService, $state, $stateParams){
        $scope.news = configurationService.getNewsById($stateParams.id);
    }])

    .controller('FaqEditController', ['$scope', 'baseURL', 'configurationService', '$state', '$stateParams', function($scope, baseURL, configurationService, $state, $stateParams){
        var Faq = function(){
            this.titile = ""
            this.description = "";
        };

        var _updataData = function(){
            $scope.faq = new Faq();
            $scope.faqList = configurationService.getAllFaqs();
        }

        _updataData();

        $scope.editFaq = function(faq){
            $scope.faq = JSON.parse(JSON.stringify(faq));
            $('#faqModal').modal('show');
        };

        $scope.createFaq = function(faq){
            $scope.faq = new Faq();
            $('#faqModal').modal('show');
        };

        $scope.deleteFaq = function(faq){
            configurationService.deleteFaqById(faq.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg);
                    if(res.success){
                        _updataData();
                    }
                });
        };

        $scope.submitFaq = function(){
            var eventPromise = configurationService.upsertFaq($scope.faq);

            eventPromise
                .$promise
                .then(function(res){
                    if(res.success){
                        _updataData();
                        $('#faqModal').modal('hide');
                    }
                });
        };


    }])
    .controller('EventController', ['$scope', 'baseURL', 'configurationService', '$state', '$stateParams', '$interval', function($scope, baseURL, configurationService, $state, $stateParams, $interval){
        var Event = function(){
            this.title = "";
            this.location = "";
            this.begin = "";
            this.end = "";
        }

        var _updataData = function(){
            $scope.event = new Event();
            $scope.eventList = configurationService.getAllEvents();
            $scope.eventList
                    .$promise
                    .then(function(){
                        $scope.eventList.forEach(function(ele){
                            ele.begin = moment(ele.begin).format('YYYY-MM-DD HH:mm')
                            ele.end = moment(ele.end).format('YYYY-MM-DD HH:mm')
                        });
                    });
        }

        _updataData();



        $('#beginDateTime,#endDateTime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            todayBtn: 'linked',
        });

        $scope.submitEvent = function(){
            var eventPromise = $scope.event.id 
                                    ? configurationService.updateEvent($scope.event)
                                    : configurationService.uploadEvent($scope.event)
            eventPromise
                .$promise
                .then(function(res){
                    if(res.success){
                        _updataData();
                        $('#eventModal').modal('hide');
                    }
                });
        };


        $scope.editEvent = function(evt){
            $scope.event = JSON.parse(JSON.stringify(evt));
            $('#eventModal').modal('show');
        };

        $scope.createEvent = function(evt){
            $scope.event = new Event();
            $('#eventModal').modal('show');
        };

        $scope.deleteEvent = function(evt){
            configurationService.deleteEventById(evt.id)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg);
                    if(res.success){
                        _updataData();
                    }
                });
        };




    }])

    .controller('EventListController', ['$scope', 'baseURL', 'configurationService', '$state', '$stateParams', '$interval', function($scope, baseURL, configurationService, $state, $stateParams, $interval){

        $scope.events = configurationService.getAllEvents();

    }])
    .controller('FavoriteEditController', ['$scope', 'baseURL', 'configurationService', '$state', '$stateParams', '$interval', function($scope, baseURL, configurationService, $state, $stateParams, $interval){
        var Favorite = function(title,link){
            if(this instanceof Favorite)
            {
                this.title = title; 
                this.link = link;
            }
            else{
                return new Favorite();
            }
        };

        configurationService.getAllFavorites()
            .$promise
            .then(function(favorites){
                if(favorites.length > 0){
                    $scope.favoriteList = favorites;
                    var length = favorites.length;
                    for(var i = length; i < 4; i++)
                    {
                        $scope.favoriteList.push(Favorite());
                    }
                }
                else{
                    $scope.favoriteList = [Favorite(),Favorite(),Favorite(),Favorite()];
                }
            })


        $scope.updateFavorite = function(favorite){
            configurationService.upsertFavorite(favorite)
                .$promise
                .then(function(res){
                    bootbox.alert(res.msg,function(){
                        if(res.success)
                        {
                            $state.reload();
                        }
                    })
                });
        };



    }])
    .controller('SystemNotificationController', ['$scope',  'studentService', '$state', 'configurationService', function($scope, studentService,  $state, configurationService){
        $scope.students = studentService.getAllStudents();

        // filter configuration
        $scope.selectedFilter = {isSelected:true};  // filter for all selected objects


        $scope.createNotification = function() {
          var studentIds = $scope.students
            .filter(function(student) {
              // filter all selectec students
              if (student.isSelected) return true;
            }).map(function(student) {
              // only use id
              return {id:student.id};
            });

          if(studentIds.length === 0 )
          {
            bootbox.alert('学员不能为空');
            return;
          }

          var submitObj = {
            accounts: studentIds,
            msg:{
                title: $scope.title,
                description: $scope.description,
                type: '系统消息' 
            }
          };

          configurationService.createNotificationForStudents(submitObj).$promise.then(function (response) {
            bootbox.alert(response.msg, function(){
                if(response.success)
                {
                    $state.reload();
                }
            });
          });

        };

        $scope.enrollToDate = new Date();
        $scope.enrollFromDate =  new Date(2002,11,29);
        // $scope.enrollFromDate.setMonth($scope.enrollFromDate.getMonth() - 2);


    }])
;
