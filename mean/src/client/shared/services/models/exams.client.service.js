// Exams service used to communicate Exams REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ExamsService', ExamsService);

  ExamsService.$inject = ['$resource', '_transform'];

  function ExamsService($resource, _transform) {
    return $resource('/api/exams/:examId', {
      examId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      listPublished: {
        url: '/api/exams/public',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
