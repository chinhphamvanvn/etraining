// Submissions service used to communicate Submissions REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('SubmissionsService', SubmissionsService);

  SubmissionsService.$inject = ['$resource', '_transform'];

  function SubmissionsService($resource, _transform) {
    return $resource('/api/submissions/:submissionId', {
      submissionId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byCandidate: {
        url: '/api/submissions/byCandidate/:candidateId',
        method: 'GET',
        isArray: true
      },
      byExamAndCandidate: {
        url: '/api/submissions/byExamAndCandidate/:examId/:candidateId',
        method: 'GET',
        isArray: true
      },
      byExam: {
        url: '/api/submissions/byExam/:examId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
