// Competencies service used to communicate Competencies REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CompetenciesService', CompetenciesService);

  CompetenciesService.$inject = ['$resource', '_transform'];

  function CompetenciesService($resource, _transform) {
    return $resource('/api/competencies/:competencyId', {
      competencyId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byGroup: {
        method: 'GET',
        url: '/api/competencies/byGroup/:groupId',
        isArray: true
      }
    });
  }
}());
