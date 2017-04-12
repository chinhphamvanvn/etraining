// Candidates service used to communicate Candidates REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ExamCandidatesService', ExamCandidatesService);

  ExamCandidatesService.$inject = ['$resource', '_transform'];

  function ExamCandidatesService($resource, _transform) {
    return $resource('/api/candidates/:candidateId', {
      candidateId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byExam: {
        url: '/api/candidates/byExam/:examId',
        method: 'GET',
        isArray: true
      },
      byUser: {
        method: 'GET',
        isArray: true,
        url: '/api/candidates/byUser/:userId'
      },
      certify: {
        method: 'POST',
        url: '/api/candidates/certify/:candidateId/:studentId',
        transformRequest: _transform.unpopulate
      },
      byUserAndSchedule: {
        method: 'GET',
        url: '/api/candidates/byUserAndSchedule/:userId/:scheduleId'
      }
    });
  }
}());
