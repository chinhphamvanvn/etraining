// Attempts service used to communicate Attempts REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('AttemptsService', AttemptsService);

  AttemptsService.$inject = ['$resource', '_transform'];

  function AttemptsService($resource, _transform) {
    return $resource('/api/attempts/:attemptId', {
      attemptId: '@_id'
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
