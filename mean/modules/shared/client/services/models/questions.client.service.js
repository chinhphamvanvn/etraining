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
      byCategoryAndLevel : {
            method: 'GET',
            url: '/api/questions/byCategoryAndLevel/:groupId/:level',
            isArray: true
          },
          byCategory : {
              method: 'GET',
              url: '/api/questions/byCategory/:groupId',
              isArray: true
            },
            byIds : {
                method: 'GET',
                url: '/api/questions/byIds/:questionIds',
                isArray: true
              }
    });
  }
}());
