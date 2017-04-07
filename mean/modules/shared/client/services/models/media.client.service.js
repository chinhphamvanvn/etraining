// Media service used to communicate Media REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('LibraryMediaService', LibraryMediaService);

  LibraryMediaService.$inject = ['$resource'];

  function LibraryMediaService($resource) {
    return $resource('/api/media/:mediumId', {
      mediumId: '@_id'
    }, {
      update: {
        method: 'PUT'
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
