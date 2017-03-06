// Candidates service used to communicate Candidates REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('ExamCandidatesService', ExamCandidatesService);

  ExamCandidatesService.$inject = ['$resource'];

  function ExamCandidatesService($resource) {
    return $resource('/api/candidates/:candidateId', {
      candidateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byExam: {
          url:'/api/candidates/byExam/:examId',
          method: 'GET',
          isArray: true
        },
        byUser: {
            method: 'GET',
            isArray:true,
            url:'/api/candidates/byUser/:userId'
          },
    });
  }
}());
