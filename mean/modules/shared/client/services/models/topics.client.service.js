// Topics service used to communicate Topics REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('ForumTopicsService', ForumTopicsService);

  ForumTopicsService.$inject = ['$resource'];

  function ForumTopicsService($resource) {
    return $resource('/api/topics/:topicId', {
      topicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byCourse: {
          url:'/api/topics/byForum/:forumId',
          method: 'GET',
          isArray: true
        }
    });
  }
}());
