// Forums service used to communicate Forums REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ForumsService', ForumsService);

  ForumsService.$inject = ['$resource', '_transform'];

  function ForumsService($resource, _transform) {
    return $resource('/api/forums/:forumId', {
      forumId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byCourse: {
        url: '/api/forums/byCourse/:courseId',
        method: 'GET'
      }
    });
  }
}());
