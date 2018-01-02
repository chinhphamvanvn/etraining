// Schemes service used to communicate Schemes REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('GradeSchemesService', GradeSchemesService);

  GradeSchemesService.$inject = ['$resource', '_transform'];

  function GradeSchemesService($resource, _transform) {
    return $resource('/api/schemes/:schemeId', {
      schemeId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byEdition: {
        method: 'GET',
        url: '/api/schemes/byEdition/:editionId'
      }
    });
  }
}());
