// Attempts service used to communicate Attempts REST endpoints
(function () {
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
      byExamAndUser: {
          url:'/api/attempts/byExamAndUser/:examId/:candidateId',
          method: 'GET',
          isArray: true
        },
        byUser: {
            url:'/api/attempts/byUser/:candidateId',
            method: 'GET',
            isArray: true
          },
          byExam: {
              url:'/api/attempts/byExam/:examId',
              method: 'GET',
              isArray: true
            }
    });
  }
}());
