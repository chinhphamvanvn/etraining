// Questions service used to communicate Questions REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('QuestionsService', QuestionsService);

  QuestionsService.$inject = ['$resource'];

  function QuestionsService($resource) {
    return $resource('/api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
        byFilter : {
            method: 'GET',
            url: '/api/questions/byFilter/:groupId/:level',
            isArray: true
          }
    });
  }
}());
