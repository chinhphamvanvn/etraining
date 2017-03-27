(function () {
    'use strict';

    angular
      .module('lms')
      .controller('ProgramsJoinController', ProgramsJoinController);

    ProgramsJoinController.$inject = [ '$scope', '$rootScope','$state', '$stateParams', 'Authentication','UsersService', 'programResolve', 'Notification', 'CourseProgramsService', 'ProgramMembersService','localStorageService', '_'];

    function ProgramsJoinController( $scope,$rootScope, $state, $stateParams, Authentication,UsersService,  program, Notification, CourseProgramsService, ProgramMembersService,localStorageService, _) {
      var vm = this;
      vm.user = Authentication.user;
      vm.program = program;
      vm.gotoWorkspace = gotoWorkspace;
      
      $rootScope.toBarActive = true;
      $rootScope.topMenuActive = true;
      
      function gotoWorkspace() {
          if (_.contains(vm.user.roles,'admin'))
              $state.go('admin.workspace.dashboard');
          else
              $state.go('workspace.lms.courses.me');
      }
      
      $scope.$on('$destroy', function() {
          $rootScope.toBarActive = false;
          $rootScope.topMenuActive = false;
      });
      vm.member = ProgramMembersService.byUserAndProgram({programId:vm.program._id,userId:localStorageService.get('userId')},function() {
      },function() {
          vm.member =null;
      });
      
   

    }
  }());

