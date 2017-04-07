// Attempts service used to communicate Attempts REST endpoints
(function() {
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
      },
      byCourse: {
        url: '/api/attempts/byCourse/:courseId',
        method: 'GET',
        isArray: true
      },
      byMember: {
        url: '/api/attempts/byMember/:memberId',
        method: 'GET',
        isArray: true
      },
      bySectionAndMember: {
        url: '/api/attempts/bySectionAndMember/:editionId/:sectionId/:memberId',
        method: 'GET',
        isArray: true
      },
      bySection: {
        url: '/api/attempts/bySection/:editionId/:sectionId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
