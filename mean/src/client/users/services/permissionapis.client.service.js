// Permissionobjects service used to communicate Permissionobjects REST endpoints
(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('PermissionApisService', PermissionApisService);

  PermissionApisService.$inject = ['$resource'];

  function PermissionApisService($resource) {
    return $resource('/api/permissionapis/:permissionapiId', {
      permissionapiId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
