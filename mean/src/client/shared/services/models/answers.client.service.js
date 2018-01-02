// Answers service used to communicate Answers REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('AnswersService', AnswersService);

  AnswersService.$inject = ['$resource', '_transform'];

  function AnswersService($resource, _transform) {
    return $resource('/api/answers/:answerId', {
      answerId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      }
    });
  }
}());
