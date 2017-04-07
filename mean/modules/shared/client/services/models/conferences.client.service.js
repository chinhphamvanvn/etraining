// Conferences service used to communicate Conferences REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ConferencesService', ConferencesService);

  ConferencesService.$inject = ['$resource'];

  function ConferencesService($resource) {
    return $resource('/api/conferences/:conferenceId', {
      conferenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byClass: {
        method: 'GET',
        url: '/api/conferences/byClass/:classroomId'
      }
    });
  }
}());
