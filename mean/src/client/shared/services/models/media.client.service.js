// Media service used to communicate Media REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('LibraryMediaService', LibraryMediaService);

  LibraryMediaService.$inject = ['$resource', '_transform'];

  function LibraryMediaService($resource, _transform) {
    return $resource('/api/media/:mediumId', {
      mediumId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byGroup: {
        method: 'GET',
        isArray: true,
        url: '/api/media/byGroup/:groupId'
      },
      byKeyword: {
        method: 'GET',
        isArray: true,
        url: '/api/media/search'
      }
    });
  }
}());
