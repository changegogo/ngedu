/**
 * @file: directive.js
 * @author: lengchao
 * @version:
 * @date 2016-05-06
 */

"use strict";

var app = angular.module( "ngedu" );

/**
 * Traverse the tutorial data.
 */
app.directive('filterCourseList', function(){
  return {
     "scope":{
      courseList:'=',
      orderText:'=?', // optional string used for order by
     },
     "restrict"   : "E",
     "templateUrl": "views/template/filter-course-list.html",
     "link" : function(scope){
      scope.showCourseDetail = function(course) {
        course.showDetail = !course.showDetail;
      };
      scope.businessToString = function (businesses){
        console.log(businesses)
        return businesses.map(function(ele){return ele.name;}).toString();
      };
    }
  }
}); 
app.directive( "courseList" , function() {

	return {
		 "restrict"   : "E"
		,"replace"    : true
		,"transclude" : true
		,"templateUrl": "courseListTemplate.html"
	}
} );
app.directive( "course" , function( courseService ) {

	return {
		 "restrict"   : "E"
		,"replace"    : true
		,"transclude" : false
		,"templateUrl": "courseItemTemplate.html"
		,"require"    : "^?courseList"
		,"link"       : function( scope , element ) {

            var course = javask.object.isUndefined( scope.course.toJSON ) ? scope.course : scope.course.toJSON();
            // replace the empty character and course data.
            var html = courseService.replaceCourseDirectiveData( "courseOtherItemTemplate\\.html" , course );

			// convert to jQuery object.
			html = $( html );
			element.after( html );

			scope.showCourseDetail = function() {

				html.toggle();
			};
		}
	}
} );

app.directive("newCourseList", function(courseService, $state){
  return {
    "restrict":"E",
    "templateUrl":"../views/template/course-list.html",
    "scope":{
      courses:'='
    },
    "link": function($scope){
      $scope.showCourseDetail = function(course) {
        course.showDetail = !course.showDetail;
      };

      $scope.stopPropagation = function($event){
        $event.stopPropagation();
      };

      $scope.deleteCourse = function(course, $event){
        $event.stopPropagation()
        courseService.deleteCourseById(course.id)
          .$promise 
          .then(function(res){
            if(res.success)
            {
              $state.reload();
            }
          });
      };
    }
  }

});

/**
 * checkbox list group
 */
app.directive( "checkboxGroup" , function() {

    return {
         "restrict": "A"
        ,"link"    : function( scope , element , attrs ) {

            // determine initial checked boxes
            /*element.eq( 0 ).prop(
                 "checked"
                ,scope.businessArray.indexOf( scope.business.id ) !== -1
            );*/
            $.each( scope.businessArray , function( index , business ) {

                business.id == scope.business.id && element.eq( 0 ).prop( "checked" , true );
            } );

            // update businessArray on click
            element.on( "click" , function() {

                var index = scope.businessArray.indexOf( scope.business );

                element.eq( 0 ).prop( "checked" )
                    // add if checked
                    ? index === -1 && scope.businessArray.push( scope.business )
                    // remove if unchecked
                    : index !== -1 && scope.businessArray.splice( index , 1 )
                ;

                // sort and update DOM display
                scope.$apply( scope.businessArray.sort( function( a , b ) {

                    return a.id - b.id;
                } ) );

                //console.log( scope.businessArray );
            } );
        }
    };
} );

/**
 * 课件搜索表单事件处理
 */
app.directive( "courseSearchReady" , function() {

    return {
         "restrict": "A"
        ,"link"    : function( scope , searchForm , attrs ) {


        }
    };
} );

/**
 * 显示/隐藏选择题备用选项
 */
app.directive( "displayChoiceQuestionOption" , function() {

    return {
         "restrict": "A"
        ,"link"    : function( scope , checkboxGroup ) {

            var  questionBankModel         = scope.questionBankModel
                //,questionBankOptions       = questionBankModel.questionBankOptions
                ,choiceQuestionOptionGroup = checkboxGroup.find( ".checkbox-inline" )
                //,radioGroup                = checkboxGroup.find( ".radio-inline" )
                ,optionFrame               = $( ".question-option-frame" )
                ,displayOptionGroup
            ;

            /**
             * 是否显示选择题的备用选项
             */
            displayOptionGroup = function() {

                // clear options
                scope.questionBankModel.questionBankOptions = [];

                switch( questionBankModel.type ) {
                    // 选择题
                    case "ChoiceQuestion":
                        choiceQuestionOptionGroup.removeClass( "hidden" );
                        // optionFrame.removeClass( "hidden" );
                        break;
                    // 判断题
                    case "TrueOrFalseQuestion":
                        choiceQuestionOptionGroup.addClass( "hidden" );
                        // optionFrame.addClass( "hidden" );

                        break;
                }
            };

            scope.$watch( "questionBankModel.type" , function( newValue , oldValue ) {

                if( newValue == oldValue ) {
                    return;
                }

                displayOptionGroup();
            } );

            //radioGroup.find( ">input" ).on( "click" , displayOptionGroup );
            displayOptionGroup();
        }
    };
} );
/**
 * 检查选择题的正确答案数
 */
app.directive( "checkRightAnswerExist" , function() {

    return {
         "restrict": "A"
        ,"link"    : function( scope , checkbox ) {

            /**
             * 判断是否存在正确答案的选项
             *
             * @return {boolean}
             */
            var hasRightAnswerOption = function() {

                var  list      = $( "ol.question-options" )
                    ,rightText = list.find( ">li>span.text-primary" )
                ;

                return rightText.length > 0;
            };

            checkbox.on( "click" , function() {

                var isChecked = checkbox.prop( "checked" );
                if( !isChecked ) {
                    return;
                }

                if( hasRightAnswerOption() && !scope.questionBankModel.isMultiSelect ) {

                    bootbox.alert( "单项选择题只能有一个正确答案！" );
                    return false;
                }
            } );
        }
    };
} );

/**
 * 触发 bootstrap-datetimepicker
 */
app.directive( "triggerBootstrapDatetimepicker" , function() {

    return {
         "restrict": "A"
        ,"link"    : function( scope , element , attrs ) {

            var  id      = attrs.triggerBootstrapDatetimepicker
                ,handler = $( id )
            ;

            if( !handler ) {
                return;
            }

            element.on( "click" , function( e ) {

                handler.focus();
                e.stopPropagation();
            } );
        }
    }
} );

app.directive('classCoursesList', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/template/class-courses-list.html',
    scope: {
      courses: '=',        // main data
      deletable:'=?',       // optional, show delete button
      searchObject:'=?',    // optional, filter object
      searchText:'=?',    // optional, filter object
      selectable:'=?',     // optional, show selected button
      showFinish:'=?',      // optional, show if finished
      showFinishTime:'=?',  // optional, show finished time
      coursesPerPage:'=?', // optional, default items is 5
      paginationId: '@'  // optional, paginate-id
    },
    link: function($scope) {
      if($scope.coursesPerPage === undefined){
        $scope.coursesPerPage = 5; // coursesPerPage; default value 5;
      }

      $scope.pagination = {current:1};


      //courses
      $scope.coursesPageChanged = function(newPage) {
      };

      $scope.deleteCourse = function(course){
        course.isSelected = false;
      };

      $scope.selectAllCourses = function(){
        $scope.selectAll = !$scope.selectAll; // th tag bug?
        var filteredCourses = $scope.$eval("courses | filter:searchObject");
        filteredCourses.forEach(function(course){
          course.isSelected = $scope.selectAll; //selectAll checkBox model
        });
      };
    }
  };
});


//选中的对象 isSelected 会标记为 true
app.directive('studentsList', ['studentService', '$state', function(studentService, $state) {
  return {
    restrict: 'E',
    templateUrl: 'views/template/students-list.html',
    scope: {
      students: '=',      // initial students data
      showFilter: '<?',    // optional, show filter 
      showFinish: '=?',   // optional, show finish
      showRole:'=?',       // optional, show roles 
      assignRoleFn:'&',       // optional, callback
      deletable:'=?',      // optional, show delete button
      selectable:'=?',     // optional, show selected button
      editable:'=?',     // optional, show selected button
      searchObject:'=?',   // optional, filter object
      enrollFromDate:'=?', // enrollTimeFilter from time
      enrollToDate:'=?',   // enrollTimeFilter to time
      itemsPerPage:'=?',  // optional, default items is 5
      paginationId: '@' // optional, dir-paginate-id
    },
    link: function($scope) {
      if($scope.enrollToDate === undefined)
      {
        $scope.enrollToDate = new Date();
      }

      if($scope.enrollFromDate === undefined)
      {
        $scope.enrollFromDate =  new Date('1971');
      }

      if($scope.showFilter === undefined)
      {
        $scope.showFilter = false;
      }

      $scope.Math = window.Math;
      if ($scope.itemsPerPage === undefined) {
        $scope.itemsPerPage = 5; // itemsPerPage; default value 5;
      }
      $scope.pagination = {current:1};

      $scope.pageChanged = function(newPage) {
      };

      $scope.deleteStudent = function(student) {
        student.isSelected = false;
      };

      // 全选所有过滤后的条目
      $scope.selectAllStudents = function(){
        $scope.selectAll = !$scope.selectAll; // th tag bug?
        var filterdStudents = $scope.$eval("students | filter:searchObject | filter:enrollTimeFilter(enrollFromDate, enrollToDate)");
        filterdStudents.forEach(function(stu){
          stu.isSelected = $scope.selectAll; //selectAll checkBox model
        });
      };


      // 按入职日期过滤学员
      $scope.enrollTimeFilter = function(from, to){
        return function(item){
          if(from != undefined && new Date(item.enrollTime) < from) return false;
          if(to != undefined && new Date(item.enrollTime) > to) return false;
          return true;
        };
      };

      $scope.rolesToString = function(roles){
        return roles.map(function(role){
          return role.name;
        }).toString();
      }


      $scope.showEditModal = function(stu){
        $scope.selectedStudent = JSON.parse(JSON.stringify(stu));
        $scope.selectedStudent.enrollTime = new Date($scope.selectedStudent.enrollTime);
        $('#editStuModal').modal('show');
      };

      $scope.updateStudent = function () {
        studentService.updateStudent($scope.selectedStudent)
          .$promise
          .then(function(res){
            bootbox.alert(res.msg);
            if(res.success)
            {
              $('#editStuModal').modal('hide');
            }
          })
      };

      $('#editStuModal').on('hidden.bs.modal', function(e){
        $state.reload();
      });

      $scope.resetPassword = function(stu){
        studentService.resetPasswordById(stu.id)
          .$promise
          .then(function(res){
            bootbox.alert(res.msg);
          })
      };

    }
  };
}]);


app.directive('notificationList', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/template/notification-list.html',
    scope:{
      notifications:'=', // notification list
      searchObject:'=?',   // optional, filter object
    },
    link: function($scope){
    }
  };
});


app.directive('questionList', [ 'questionBankService', '$state', function(questionBankService, $state){
  return {
    restrict:'E',
    templateUrl:'views/template/question-list.html',
    scope:{
      questions:'=', // question array
      selectable:'<?', // is selectable
      editable:'<?', // is editable
      searchObject:'=?',   // optional, filter object
      paginationId: '@' // optional, dir-paginate-id
    },
    link:function($scope){
      if ($scope.itemsPerPage === undefined) {
        $scope.itemsPerPage = 5; // itemsPerPage; default value 5;
      }

      // 全选所有过滤后的条目
      $scope.selectAllQuestions = function(){
        $scope.selectAll = !$scope.selectAll; // th tag bug?
        var filteredQuestions = $scope.$eval("questions");
        filteredQuestions.forEach(function(question){
          question.isSelected = $scope.selectAll; //selectAll checkBox model
        });
      };

      $scope.deleteQuestion = function(question){
        questionBankService.deleteQuestionById(question.id)
          .$promise
          .then(function(res){
            if(res){$state.reload();}
          });
      };



    }
  }

}])

// 冷超给select用 -1 作为默认值，故创建此validate判断必填项排除默认值。
app.directive('noMinusValue', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.noMinusValue = function(modelValue, viewValue) {

        if(modelValue===-1){return false;}
        else{return true;}

      };
    }
  };
});


