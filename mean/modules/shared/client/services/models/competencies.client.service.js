// Competencies service used to communicate Competencies REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CompetenciesService', CompetenciesService);

  CompetenciesService.$inject = ['$resource'];

  function CompetenciesService($resource) {
    return $resource('/api/competencies/:competencyId', {
      competencyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byGroup : {
          method: 'GET',
          url: '/api/competencies/byGroup/:groupId',
          isArray: true
        }
    });
  }
}());
