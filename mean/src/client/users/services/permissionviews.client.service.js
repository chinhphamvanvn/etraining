// Permissionviews service used to communicate Permissionviews REST endpoints
(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('PermissionViewsService', PermissionViewsService);

  PermissionViewsService.$inject = ['$resource'];

  function PermissionViewsService($resource) {
    return $resource('/api/permissionviews/:permissionviewId', {
      permissionviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
