'use strict';
var AuthorityBroadcast = 'authorityUpdated';
var app = angular.module('ngedu', [
        'angularUtils.directives.dirPagination',
        'ngResource',
        'ui.router',
        'multipleSelect',
        'ngFileUpload',
        'textAngular',
        // 'ae-datetimepicker'
    ])
    .config(function($stateProvider, $urlRouterProvider ) {
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'ContentController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            .state('app.index', {
                url: '^/index'
            })
            .state('app.index.faq', {
                url:'/faq',
                views:{
                    'content@':{
                        templateUrl: 'views/faq.html',
                        controller: 'FAQController'
                    }
                }
            })
            .state('login', {
                url: '/login',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/login.html',
                        controller: 'ContentController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            .state('resetPassword', {
                url: '/resetPassword',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/reset-password.html',
                        controller: 'ResetPasswordController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            /**************************************************************************************/
            // course
            .state("course", {
                "url": "/course",
                "views": {
                    "header@": {
                        "templateUrl": "views/header.html",
                        "controller": 'HeaderController'
                    },
                    "content@": {
                        "templateUrl": "views/course/list.html",
                        "controller": "CourseListController"
                    },
                    "footer@": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // search
            .state( "course.search" , {
                 //"url": "/search/{chapterId:int}/{sectionId:int}/{representationId:int}/{deviceId:int}/{postId:int}/{businessIds}/{lecturer}/{courseName}/{sort}"
                 //"url": "/search/{cahpterId:int}/{sort}"
                 "url": "/search?courseName&deviceId&representationId&lecturer&postId&sort&businessIds"
                ,"views": {
                    "content@": {
                         "templateUrl": "views/course/search.html"
                        ,"controller" : "CourseSearchController"
                    }
                }
            } )
            // course.add
            .state("course.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/course/add.html",
                        "controller": "CourseAddController"
                    }
                }
            })
            // course.edit
            .state("course.edit", {
                "url": "/edit/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/course/edit.html",
                        "controller": "CourseEditController"
                    }
                }
            })
            /**************************************************************************************/
            // device
            .state("device", {
                "url": "/device",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "content": {
                        "templateUrl": "views/device/list.html",
                        "controller": "DeviceListController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // device.add
            .state("device.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/device/add.html",
                        "controller": "DeviceAddController"
                    }
                }
            })
            // device.edit
            .state("device.edit", {
                "url": "/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/device/edit.html",
                        "controller": "DeviceEditController"
                    }
                }
            })
            /**************************************************************************************/
            // chapter
            .state("chapter", {
                "url": "/chapter",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "content": {
                        "templateUrl": "views/chapter/list.html",
                        "controller": "ChapterListController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // chapter.add
            .state("chapter.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/chapter/add.html",
                        "controller": "ChapterAddController"
                    }
                }
            })
            // chapter.edit
            .state("chapter.edit", {
                "url": "/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/chapter/edit.html",
                        "controller": "ChapterEditController"
                    }
                }
            })
            /**************************************************************************************/
            // section
            .state("section", {
                "url": "/section",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "content": {
                        "templateUrl": "views/section/list.html",
                        "controller": "SectionListController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // section.add
            .state("section.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/section/add.html",
                        "controller": "SectionAddController"
                    }
                }
            })
            // section.edit
            .state("section.edit", {
                "url": "/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/section/edit.html",
                        "controller": "SectionEditController"
                    }
                }
            })
            /**************************************************************************************/
            // post
            .state("post", {
                "url": "/post",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "content": {
                        "templateUrl": "views/post/list.html",
                        "controller": "PostListController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // post.add
            .state("post.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/post/add.html",
                        "controller": "PostAddController"
                    }
                }
            })
            // post.edit
            .state("post.edit", {
                "url": "/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/post/edit.html",
                        "controller": "PostEditController"
                    }
                }
            })
            /**************************************************************************************/
            // representation
            .state("representation", {
                "url": "/representation",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "content": {
                        "templateUrl": "views/representation/list.html",
                        "controller": "RepresentationListController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // representation.add
            .state("representation.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/representation/add.html",
                        "controller": "RepresentationAddController"
                    }
                }
            })
            // representation.edit
            .state("representation.edit", {
                "url": "/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/representation/edit.html",
                        "controller": "RepresentationEditController"
                    }
                }
            })
            /**************************************************************************************/
            // business
            .state("business", {
                "url": "/business",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "content": {
                        "templateUrl": "views/business/list.html",
                        "controller": "BusinessListController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // business.add
            .state("business.add", {
                "url": "/business/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/business/add.html",
                        "controller": "BusinessAddController"
                    }
                }
            })
            .state("business.edit", {
                "url": "/{id:int}",
                "views": {
                    "content@": {
                        "templateUrl": "views/business/edit.html",
                        "controller": "BusinessEditController"
                    }
                }
            })
            /**************************************************************************************/
            // training
            .state("training", {
                "abstract": true,
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        "controller": "HeaderController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // equipment training courses list
            .state("training.device", {
                "url": "/training/device/{id:int}/{orderName}/{orderRole}",
                "views": {
                    "content@": {
                        "templateUrl": "views/course/device/list.html",
                        "controller": "DeviceCourseListController"
                    }
                }
            })
            // post training courses list
            .state("training.post", {
                "url": "/training/post/{id:int}/{orderName}/{orderRole}",
                "views": {
                    "content@": {
                        "templateUrl": "views/course/post/list.html",
                        "controller": "PostCourseListController"
                    }
                }
            })
            // equipment training courses list
            .state("training.business", {
                "url": "/training/business/{id:int}/{orderName}/{orderRole}",
                "views": {
                    "content@": {
                         "templateUrl": "views/course/business/list.html"
                        ,"controller" : "BusinessCourseListController"
                    }
                }
            })
            // detail of training info
            .state( "training.detail" , {
                 "url": "/training/{id:int}"
                ,"views": {
                    "content@": {
                         "templateUrl": "views/course/detail.html"
                        ,"controller" : "TrainingDetailController"
                    }
                }
            } )
            // detail of course with test example.
            .state( "training.test" , {
                "url": "/training/test"
                ,"views": {
                    "content@": {
                         "templateUrl": "views/course/player.html"
                        ,"controller" : "TrainingPlayerController"
                    }
                }
            } )
            /**************************************************************************************/
            // question-bank
            .state( "question-bank" , {
                 "url"  : "/question-bank"
                ,"views": {
                     "header" : {
                         "templateUrl": "views/header.html"
                        ,"controller" : "HeaderController"
                    }
                    ,"content": {
                         "templateUrl": "views/question-bank/list.html"
                        ,"controller" : "QuestionBankListController"
                    }
                    ,"footer" : {
                        "templateUrl": "views/footer.html"
                    }
                }
            } )
            // question-bank.add
            // .state( "question-bank.add" , {
            //      "url"  : "/add"
            //     ,"views": {
            //         "content@": {
            //              "templateUrl": "/views/question-bank/add.html"
            //             ,"controller" : "QuestionBankAddController"
            //         }
            //     }
            // } )
            // question-bank.edit
            .state( "question-bank.edit" , {
                 "url"  : "/edit/{id:[0-9]*}"
                ,"views": {
                    "content@": {
                         "templateUrl": "/views/question-bank/edit.html"
                        ,"controller" : "QuestionBankEditController"
                    }
                }
            } )
            /**************************************************************************************/
            // examination
            .state( "examination" , {
                 "url"  : "/examination?type"
                ,"views": {
                     "header" : {
                         "templateUrl": "views/header.html"
                        ,"controller" : "HeaderController"
                    }
                    ,"content": {
                         "templateUrl": "views/examination/list.html"
                        ,"controller" : "ExaminationListController"
                    }
                    ,"footer" : {
                        "templateUrl": "views/footer.html"
                    }
                }
            } )
            .state( "examination.add" , {
                 "url"  : "/add"
                ,"views": {
                    "content@": {
                         "templateUrl": "/views/examination/add.html"
                        ,"controller" : "ExaminationAddController"
                    }
                }
            } )
            // .state( "examination.edit" , {
            //     "url"  : "/edit/{id:int}"
            //     ,"views": {
            //         "content@": {
            //              "templateUrl": "/views/examination/edit.html"
            //             ,"controller" : "ExaminationEditController"
            //         }
            //     }
            // } )
            .state( "examination.view" , {
                "url"  : "/{id:int}"
                ,"views": {
                    "content@": {
                         "templateUrl": "/views/examination/view.html"
                        ,"controller" : "ExaminationViewController"
                    }
                }
            } )
            .state( "examination.result" , {
                "url"  : "/result/{id:int}"
                ,"views": {
                    "content@": {
                         "templateUrl": "/views/examination/result.html"
                        ,"controller" : "ExaminationResultController"
                    }
                }
            } )
            /**************************************************************************************/
            /*----------  progressing of students  ----------*/
            // course
            .state("students", {
                "url": "/students",
                "views": {
                    "header": {
                        "templateUrl": "views/header.html",
                        controller: 'HeaderController'
                    },
                    "content": {
                        "templateUrl": "views/students/students.html",
                        "controller": "StudentsController"
                    },
                    "footer": {
                        "templateUrl": "views/footer.html"
                    }
                }
            })
            // study of personal info
            .state("students.all", {
                "url": "/all",
                "views": {
                    "content@": {
                        "templateUrl": "views/students/students.html",
                        "controller": "StudentsController"
                    }
                }
            })
            // study of class info
            .state("students.classes", {
                "url": "/classes",
                "views": {
                    "content@": {
                        "templateUrl": "views/students/classes.html",
                        "controller": "ClassesController"
                    }
                }
            })
            // add class
            .state("students.classes.add", {
                "url": "/add",
                "views": {
                    "content@": {
                        "templateUrl": "views/students/class-add.html",
                        "controller": "ClassAddController"
                    }
                }
            })           
            // detail of class  info
            .state("students.classes.detail", {
                "url": "/:id",
                "views": {
                    "content@": {
                        "templateUrl": "views/students/class-detail.html",
                        "controller": "ClassDetailController"
                    }
                }
            })
            // studied
            .state("students.studied", {
                "url": "/:id/studied",
                "views": {
                    "content@": {
                        "templateUrl": "views/students/studied.html",
                        "controller": "StudiedController"
                    }
                }
            })
            // studied
            .state("students.profile", {
                "url": "/:id/profile",
                "views": {
                    "content@": {
                        "templateUrl": "views/students/stu-profile.html",
                        "controller": "ProfileController"
                    }
                }
            })
            /*----------  authority  ----------*/
            //authorty
            .state("app.authorities", {
                "url": "^/authorities"
            })
            .state("app.authorities.assignRole", {
                "url":'/assignRole',
                "views":{
                    "content@":{
                        "templateUrl":"views/authority/assign-role.html",
                        "controller":"AssignRoleController"
                    }
                }
            })
            .state("app.authorities.editRole", {
                "url":'/editRole',
                "views":{
                    "content@":{
                        "templateUrl":"views/authority/edit-role.html",
                        "controller":"EditRoleController"
                    }
                }
            })
           /*----------  system operations  ----------*/
            .state("app.system", {
                "url":"^/system"
            })
            .state("app.system.backup", {
                "url":"/backup",
                "views":{
                    "content@":{
                        "templateUrl":"views/system/backup.html",
                        "controller":"BackupController"
                    }
                }
            })
            .state("app.system.restore", {
                "url":"/restore",
                "views":{
                    "content@":{
                        "templateUrl":"views/system/restore.html",
                        "controller":"RestoreController"
                    }
                }
            })            
            .state("app.system.logging", {
                "url":"/logging",
                "views":{
                    "content@":{
                        "templateUrl":"views/system/logging.html",
                        "controller":"LoggingController"
                    }
                }
            })
            .state("app.system.index", {
                "url":"/index",
                "views":{
                    "content@":{
                        "templateUrl":"views/system/index-edit.html",
                        "controller":"IndexEditController"
                    }
                }
            })
           /*             account                 */ 
           .state("app.account", {
                "url":"^/account"
           })
           .state("app.account.profile", {
                "url":"/profile",
                "views":{
                    "content@":{
                        "templateUrl":"views/account/profile.html",
                        "controller":"SelfProfileController",  //当前账户所有信息
                    }
                }
           })
           .state("app.account.profile.notification", {
                "url":"/notifications/:id",
                "views":{
                    "content@":{
                        "templateUrl":"views/account/notification.html",
                        "controller":"NotificationController",  //当前账户所有信息
                    }
                },
                "params":{
                    notification:null
                }
           })
          .state("app.account.profile.edit", {
                "url":"/edit",
                "views":{
                    "content@":{
                        "templateUrl":"views/account/profile-edit.html",
                        "controller":"ProfileEditController",  //当前账户所有信息
                    }
                }
           })
          .state("app.management",{
            "url":"^/management"
          })
          .state("app.management.carousel",{
            "url":"/carousel",
            "views":{
                "content@":{
                    "templateUrl":"views/management/carousel-edit.html",
                    "controller":"CarouselEditController"
                }
            }
          })
          .state("app.management.faq",{
            "url":"/faq",
            "views":{
                "content@":{
                    "templateUrl":"views/management/faq-edit.html",
                    "controller":"FaqEditController"
                }
            }
          })
          .state("app.management.news",{
            "url":"/news",
            "views":{
                "content@":{
                    "templateUrl":"views/management/news-list-edit.html",
                    "controller":"NewsListEditController"
                }
            }
          })
          .state("app.management.detail",{
            "url":"/:id/detail",
            "views":{
                "content@":{
                    "templateUrl":"views/management/news-detail.html",
                    "controller":"NewsDetailController"
                }
            }
          })
          .state("app.management.news.edit",{
            "url":"/:id?type",
            "views":{
                "content@":{
                    "templateUrl":"views/management/news-edit.html",
                    "controller":"NewsEditController"
                }
            }
          })

          .state("app.management.event", {
            "url":"/event",
            "views":{
                "content@":{
                    "templateUrl":"views/management/event-edit.html",
                    "controller":"EventController"
                }
            }
          })

          .state("app.management.event.list", {
            "url":"/all",
            "views":{
                "content@":{
                    "templateUrl":"views/management/event-list.html",
                    "controller":"EventListController"
                }
            }
          })
          .state("app.management.favorite", {
            "url":"/favorite",
            "views":{
                "content@":{
                    "templateUrl":"views/management/favorite-edit.html",
                    "controller":"FavoriteEditController"
                }
            }
          })
          .state("app.management.notification", {
            "url":"/notification",
            "views":{
                "content@":{
                    "templateUrl":"views/management/system-notification.html",
                    "controller":"SystemNotificationController"
                }
            }
          })
          ;
        $urlRouterProvider.otherwise('/index');
    })
    .config(['$provide', function($provide){
        // this demonstrates how to register a new tool and add it to the default toolbar
        $provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.toolbar = [
                ['p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
                [ 'insertImage', 'insertLink', 'wordcount', 'charcount']
            ];
            return taOptions; // whatever you return will be the taOptions
        }]);
    }]);

app.run(['accountService', function(accountService){
    $.get('/accounts/session', function(response){
        if(response.success)
        {
            accountService.setAuthority(response.data.auth);
            accountService.setProfile(response.data.profile);
        }
        else{
            accountService.setAuthority({});
            accountService.setProfile({});
        }
    });
}]);
