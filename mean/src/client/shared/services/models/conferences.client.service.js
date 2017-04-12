// Conferences service used to communicate Conferences REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ConferencesService', ConferencesService);

  ConferencesService.$inject = ['$resource', '_transform'];

  function ConferencesService($resource, _transform) {
    return $resource('/api/conferences/:conferenceId', {
      conferenceId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byClass: {
        method: 'GET',
        url: '/api/conferences/byClass/:classroomId'
      }
    });
  }
}());
