(function() {
  'use strict';

  angular
    .module('lms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('workspace.lms.programs', {
        abstract: true,
        url: '/programs',
        template: '<ui-view/>'
      })
      .state('workspace.lms.programs.me', {
        url: '/me',
        templateUrl: '/src/client/lms/views/my-programs.client.view.html',
        controller: 'MyProgramsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join', {
        url: '/join/:programId',
        templateUrl: '/src/client/lms/views/program-board/join-program.client.view.html',
        controller: 'ProgramsJoinController',
        controllerAs: 'vm',
        resolve: {
          programResolve: getProgram
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'teacher']
        }
      })
      .state('workspace.lms.programs.join.progressboard', {
        url: '/progressboard',
        templateUrl: '/src/client/lms/views/program-board/manager/progress.board-programs.client.view.html',
        controller: 'ProgramProgressboardController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser,
          programResolve: getProgram,
          programMemberResolve: getProgramMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager']
        }
      })
      .state('workspace.lms.programs.join.progressboard-member', {
        url: '/progressboard-member/:memberId',
        templateUrl: '/src/client/lms/views/program-board/progress.book-programs.client.view.html',
        controller: 'ProgramProgressboardMemberController',
        controllerAs: 'vm',
        resolve: {
          programMemberResolve: getProgramMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join.intro', {
        url: '/intro',
        templateUrl: '/src/client/lms/views/program-board/intro-program.client.view.html',
        controller: 'ProgramIntroController',
        controllerAs: 'vm',
        resolve: {},
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      })
      .state('workspace.lms.programs.join.progressbook', {
        url: '/progress',
        templateUrl: '/src/client/lms/views/program-board/progress.book-programs.client.view.html',
        controller: 'ProgramProgressController',
        controllerAs: 'vm',
        resolve: {
          programMemberResolve: getProgramMember
        },
        data: {
          roles: ['user'],
          courseRoles: ['manager', 'student']
        }
      });
  }

  getProgram.$inject = ['$stateParams', 'CourseProgramsService'];

  function getProgram($stateParams, CourseProgramsService) {
    return CourseProgramsService.get({
      programId: $stateParams.programId
    }).$promise;
  }

  getProgramMember.$inject = ['$stateParams', 'ProgramMembersService', 'localStorageService'];

  function getProgramMember($stateParams, ProgramMembersService, localStorageService) {
    if ($stateParams.memberId)
      return ProgramMembersService.get({
        programmemberId: $stateParams.memberId
      }).$promise;
    return ProgramMembersService.byUserAndProgram({
      programId: $stateParams.programId,
      userId: localStorageService.get('userId')
    }).$promise;
  }
  
  getUser.$inject = ['UsersService'];

  function getUser(UsersService) {
    return UsersService.me().$promise;
  }

}());
