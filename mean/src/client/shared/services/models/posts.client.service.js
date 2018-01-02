// Posts service used to communicate Posts REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ForumPostsService', ForumPostsService);

  ForumPostsService.$inject = ['$resource', '_transform'];

  function ForumPostsService($resource, _transform) {
    return $resource('/api/posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byTopic: {
        url: '/api/posts/byTopic/:topicId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
