// Programs service used to communicate Programs REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseProgramsService', CourseProgramsService);

  CourseProgramsService.$inject = ['$resource'];

  function CourseProgramsService($resource) {
    return $resource('/api/programs/:programId', {
      programId: '@_id'
    }, {
      update: {
        method: 'PUT'
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
      }
    });
  }
}());
