// Answers service used to communicate Answers REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('AnswersService', AnswersService);

  AnswersService.$inject = ['$resource'];

  function AnswersService($resource) {
    return $resource('/api/answers/:answerId', {
      answerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
