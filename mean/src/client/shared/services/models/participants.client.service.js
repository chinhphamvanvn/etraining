// Participants service used to communicate Participants REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ConferenceParticipantsService', ConferenceParticipantsService);

  ConferenceParticipantsService.$inject = ['$resource', '_transform'];

  function ConferenceParticipantsService($resource, _transform) {
    return $resource('/api/participants/:participantId', {
      participantId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byConference: {
        method: 'GET',
        url: '/api/participants/byConference/:conferenceId',
        isArray: true
      },
      byMember: {
        method: 'GET',
        url: '/api/participants/byMember/:memberId'
      }
    });
  }
}());
