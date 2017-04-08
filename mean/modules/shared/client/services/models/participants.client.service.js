// Participants service used to communicate Participants REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ConferenceParticipantsService', ConferenceParticipantsService);

  ConferenceParticipantsService.$inject = ['$resource'];

  function ConferenceParticipantsService($resource) {
    return $resource('/api/participants/:participantId', {
      participantId: '@_id'
    }, {
      update: {
        method: 'PUT'
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
