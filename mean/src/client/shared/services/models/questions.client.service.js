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
        transformRequest: function(question) {
          if (question.svgData)
            question.svgData = angular.toJson(question.svgData);
          question = _transform.unpopulate(question);
          return question;
        }
      },
      save: {
        method: 'POST',
        transformRequest: function(question) {
          question = _transform.unpopulate(question);
          if (question.svgData)
            question.svgData = angular.toJson(question.svgData);
          return question;
        }
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
