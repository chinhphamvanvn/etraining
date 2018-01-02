// Materials service used to communicate Materials REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseMaterialsService', CourseMaterialsService);

  CourseMaterialsService.$inject = ['$resource', '_transform'];

  function CourseMaterialsService($resource, _transform) {
    return $resource('/api/materials/:materialId', {
      materialId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byCourse: {
        url: '/api/materials/byCourse/:editionId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
