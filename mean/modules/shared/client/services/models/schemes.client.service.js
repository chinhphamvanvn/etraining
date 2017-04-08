// Schemes service used to communicate Schemes REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('GradeSchemesService', GradeSchemesService);

  GradeSchemesService.$inject = ['$resource'];

  function GradeSchemesService($resource) {
    return $resource('/api/schemes/:schemeId', {
      schemeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byEdition: {
        method: 'GET',
        url: '/api/schemes/byEdition/:editionId'
      }
    });
  }
}());
