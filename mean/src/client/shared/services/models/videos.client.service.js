// Videos service used to communicate Videos REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('VideosService', VideosService);

  VideosService.$inject = ['$resource', '_transform'];

  function VideosService($resource, _transform) {
    return $resource('/api/videos/:videoId', {
      videoId: '@_id'
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
