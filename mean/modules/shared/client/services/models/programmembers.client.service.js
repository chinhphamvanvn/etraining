// Programmembers service used to communicate Programmembers REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('ProgramMembersService', ProgramMembersService);

  ProgramMembersService.$inject = ['$resource'];

  function ProgramMembersService($resource) {
    return $resource('/api/programmembers/:programmemberId', {
      programmemberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byProgram: {
          method: 'GET',
          isArray:true,
          url:'/api/programmembers/byProgram/:programId'
        },
        byUser: {
            method: 'GET',
            isArray:true,
            url:'/api/programmembers/byUser/:userId'
          },
          withdraw: {
              method: 'PUT',
              url:'/api/programmembers/withdraw/:programmemberId'
            },
            complete: {
                method: 'PUT',
                url:'/api/programmembers/complete/:programmemberId/:managerId'
              },
          byUserAndProgram: {
              method: 'GET',
              url:'/api/programmembers/byUserAndProgram/:userId/:programId'
            }
    });
  }
}());
