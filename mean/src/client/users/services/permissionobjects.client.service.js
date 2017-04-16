// Permissionobjects service used to communicate Permissionobjects REST endpoints
(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('PermissionObjectsService', PermissionObjectsService);

  PermissionObjectsService.$inject = ['$resource'];

  function PermissionObjectsService($resource) {
    return $resource('/api/permissionobjects/:permissionobjectId', {
      permissionobjectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
