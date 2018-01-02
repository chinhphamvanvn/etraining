// Programs service used to communicate Programs REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseProgramsService', CourseProgramsService);

  CourseProgramsService.$inject = ['$resource', '_transform'];

  function CourseProgramsService($resource, _transform) {
    return $resource('/api/programs/:programId', {
      programId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      listPublic: {
        method: 'GET',
        isArray: true,
        url: '/api/programs/public'
      },
      listPrivate: {
        method: 'GET',
        isArray: true,
        url: '/api/programs/private'
      },
      listRestricted: {
        method: 'GET',
        isArray: true,
        url: '/api/programs/restricted'
      },
      programsByGroup: {
        method: 'GET',
        isArray: true,
        url: '/api/programs/byGroup/:groupId'
      }
    });
  }
}());
