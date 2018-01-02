(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('cms')
    .directive('courseView', ['GroupsService', 'CoursesService', 'CompetenciesService', '$q', '_', courseView]);

  function courseView(GroupsService, CoursesService, CompetenciesService, $q, _) {
    return {
      scope: {
        course: '='
      },
      templateUrl: '/src/client/cms/directives/course-view/course-view.client.view.html',
      link: function(scope, element, attributes) {
      }
    };
  }
}());
