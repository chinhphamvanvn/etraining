(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('courseViewSimple', ['GroupsService','CoursesService','_', courseViewSimple]);

  function courseViewSimple(GroupsService,CourseEditionsService,_) {
      
      return {
          scope: {
              course: "="
          },
          templateUrl:'/modules/lms/client/directives/course-view-simple/view-course.directive.client.view.html',
          link: function (scope, element, attributes) {
              // scope.edition = CourseEditionsService.byCourse({courseId:scope.course._id});
          }
      }
  }
}());
