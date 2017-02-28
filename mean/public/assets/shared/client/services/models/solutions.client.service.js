// Solutions service used to communicate Solutions REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('SolutionsService', SolutionsService);

  SolutionsService.$inject = ['$resource'];

  function SolutionsService($resource) {
    return $resource('/api/solutions/:solutionId', {
      solutionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
