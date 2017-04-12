// Questions service used to communicate Questions REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('QuestionsService', QuestionsService);

  QuestionsService.$inject = ['$resource', '_transform'];

  function QuestionsService($resource, _transform) {
    return $resource('/api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      bulkCreate: {
        method: 'POST',
        url: '/api/questions/bulk/:questions'
      },
      byCategoryAndLevel: {
        method: 'GET',
        url: '/api/questions/byCategoryAndLevel/:groupId/:level',
        isArray: true
      },
      byCategory: {
        method: 'GET',
        url: '/api/questions/byCategory/:groupId',
        isArray: true
      },
      byIds: {
        method: 'GET',
        url: '/api/questions/byIds/:questionIds',
        isArray: true
      }
    });
  }
}());
