// Forums service used to communicate Forums REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ForumsService', ForumsService);

  ForumsService.$inject = ['$resource'];

  function ForumsService($resource) {
    return $resource('/api/forums/:forumId', {
      forumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byCourse: {
        url: '/api/forums/byCourse/:courseId',
        method: 'GET'
      }
    });
  }
}());
