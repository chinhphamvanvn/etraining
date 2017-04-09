// Videos service used to communicate Videos REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('VideosService', VideosService);

  VideosService.$inject = ['$resource'];

  function VideosService($resource) {
    return $resource('/api/videos/:videoId', {
      videoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
