// Posts service used to communicate Posts REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ForumPostsService', ForumPostsService);

  ForumPostsService.$inject = ['$resource'];

  function ForumPostsService($resource) {
    return $resource('/api/posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byTopic: {
        url: '/api/posts/byTopic/:topicId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
