(function() {
  'use strict';

  angular
    .module('conference')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('conference', {
        url: '/conference/:classroomId/:memberId',
        templateUrl: '/src/client/conference/views/conference.client.view.html',
        controller: 'ConferenceController',
        controllerAs: 'vm',
        resolve: {
          classResolve: getClassroom,
          memberResolve: getMember
        },
        data: {
          roles: ['user']
        }
      })
  }

  getClassroom.$inject = ['$stateParams', 'ClassroomsService'];

  function getClassroom($stateParams, ClassroomsService) {
    return ClassroomsService.get({
      classroomId: $stateParams.classroomId
    }).$promise;
  }

  getMember.$inject = ['$stateParams', 'CourseMembersService'];

  function getMember($stateParams, CourseMembersService) {
    return CourseMembersService.get({
      memberId: $stateParams.memberId
    }).$promise;
  }


}());
