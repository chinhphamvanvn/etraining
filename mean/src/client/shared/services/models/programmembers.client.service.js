// Programmembers service used to communicate Programmembers REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ProgramMembersService', ProgramMembersService);

  ProgramMembersService.$inject = ['$resource', '_transform'];

  function ProgramMembersService($resource, _transform) {
    return $resource('/api/programmembers/:programmemberId', {
      programmemberId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byProgram: {
        method: 'GET',
        isArray: true,
        url: '/api/programmembers/byProgram/:programId'
      },
      byUser: {
        method: 'GET',
        isArray: true,
        url: '/api/programmembers/byUser/:userId'
      },
      withdraw: {
        method: 'PUT',
        url: '/api/programmembers/withdraw/:programmemberId',
        transformRequest: _transform.unpopulate
      },
      complete: {
        method: 'PUT',
        url: '/api/programmembers/complete/:programmemberId/:teacherId',
        transformRequest: _transform.unpopulate
      },
      byUserAndProgram: {
        method: 'GET',
        url: '/api/programmembers/byUserAndProgram/:userId/:programId'
      }
    });
  }
}());
