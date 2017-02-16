// Attempts service used to communicate Attempts REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseAttemptsService', CourseAttemptsService);

  CourseAttemptsService.$inject = ['$resource'];

  function CourseAttemptsService($resource) {
    return $resource('/api/attempts/:attemptId', {
      attemptId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byCourseAndMember: {
          url:'/api/attempts/byCourseAndMember/:editionId/:memberId',
          method: 'GET',
          isArray: true
        },
        bySectionAndMember: {
            url:'/api/attempts/bySectionAndMember/:editionId/:sectionId/:memberId',
            method: 'GET',
            isArray: true
          }
    });
  }
}());
