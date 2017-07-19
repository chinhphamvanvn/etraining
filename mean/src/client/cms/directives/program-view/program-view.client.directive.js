(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('cms')
    .directive('programView', ['CoursesService', 'CompetenciesService', '$q', '_', 'CourseEditionsService', programView]);

  function programView(CoursesService, CompetenciesService, $q, _, CourseEditionsService) {
    return {
      scope: {
        program: '='
      },
      templateUrl: '/src/client/cms/directives/program-view/program-view.client.view.html',
      link: function(scope, element, attributes) {
        scope.program.courses.forEach(function(course) {
          course.edition = CourseEditionsService.byCourse({
            courseId: course._id
          });
        });
        
      }
    };
  }
}());
