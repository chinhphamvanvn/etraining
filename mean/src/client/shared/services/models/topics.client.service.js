// Topics service used to communicate Topics REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ForumTopicsService', ForumTopicsService);

  ForumTopicsService.$inject = ['$resource', '_transform'];

  function ForumTopicsService($resource, _transform) {
    return $resource('/api/topics/:topicId', {
      topicId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byForum: {
        url: '/api/topics/byForum/:forumId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
