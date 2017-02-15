// Materials service used to communicate Materials REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseMaterialsService', CourseMaterialsService);

  CourseMaterialsService.$inject = ['$resource'];

  function CourseMaterialsService($resource) {
    return $resource('/api/materials/:materialId', {
      materialId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byCourse: {
          url:'/api/materials/byCourse/:editionId',
          method: 'GET',
          isArray:true
        },
    });
  }
}());
