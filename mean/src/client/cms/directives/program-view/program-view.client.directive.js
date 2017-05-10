(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('cms')
    .directive('programView', ['CoursesService', 'CompetenciesService', '$q', '_', programView]);

  function programView(CoursesService, CompetenciesService, $q, _) {
    return {
      scope: {
        program: '='
      },
      templateUrl: '/src/client/cms/directives/program-view/program-view.client.view.html',
      link: function(scope, element, attributes) {
      }
    };
  }
}());
