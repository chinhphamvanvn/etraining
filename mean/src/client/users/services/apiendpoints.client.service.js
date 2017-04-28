// API Endpoint service used to communicate API Endpoint REST endpoints
(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('ApiEndpointsService', ApiEndpointsService);

  ApiEndpointsService.$inject = ['$resource'];

  function ApiEndpointsService($resource) {
    return $resource('/api/endpoints/:endpointId', {
      permissionapiId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
