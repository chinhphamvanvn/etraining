// Attempts service used to communicate Attempts REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('AttemptsService', AttemptsService);

  AttemptsService.$inject = ['$resource'];

  function AttemptsService($resource) {
    return $resource('/api/attempts/:attemptId', {
      attemptId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
