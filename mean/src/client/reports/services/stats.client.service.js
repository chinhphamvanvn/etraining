// Stats service used to communicate Stats REST endpoints
(function () {
  'use strict';

  angular
    .module('reports')
    .factory('StatsService', StatsService);

  StatsService.$inject = ['$resource'];

  function StatsService($resource) {
    return $resource('/api/stats/:statId', {
      statId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
