// Exercises service used to communicate Exercises REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('ExercisesService', ExercisesService);

  ExercisesService.$inject = ['$resource', '_transform'];

  function ExercisesService($resource, _transform) {
    return $resource('/api/exercises/:exerciseId', {
      exerciseId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
    });
  }
}());
