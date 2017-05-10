(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .directive('courseCard', ['OptionsService', 'CourseEditionsService', '_', courseCard]);

  function courseCard(OptionsService, CourseEditionsService, _) {
    return {
      scope: {
        course: '='
      },
      templateUrl: '/src/client/core/directives/course-card/course.card.client.view.html',
      link: function(scope, element, attributes) {
        scope.edition = CourseEditionsService.byCourse({
          courseId: scope.course._id
        });
      }
    };
  }
}());
