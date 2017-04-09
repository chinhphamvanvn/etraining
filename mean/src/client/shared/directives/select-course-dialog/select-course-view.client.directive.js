(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('selectCourseDialog', ['GroupsService', '$timeout', 'CoursesService', '_', selectCourseDialog]);

  function selectCourseDialog(GroupsService, $timeout, CoursesService, _) {
    return {
      scope: {
        callback: '=',
        dialogId: '='
      },
      templateUrl: '/src/client/shared/directives/select-course-dialog/select-course-view.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.selectGroup = function(groups) {
          scope.courses = [];
          _.each(groups, function(group) {
            CoursesService.byGroup({
              groupId: group
            }, function(courses) {
              scope.courses = scope.courses.concat(courses);
            });
          });
        };

        scope.finish = function() {
          var selectedCourses = _.filter(scope.courses, function(course) {
            return course.selected;
          });
          if (scope.callback)
            scope.callback(selectedCourses);
        };

        scope.selectAll = function() {
          _.each(scope.courses, function(course) {
            course.selected = scope.allCourse;
          });
        };
      }
    };
  }
}());
