(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ProgramIntroController', ProgramIntroController);

  ProgramIntroController.$inject = ['$scope', '$state', '$window', 'ProgramMembersService', 'Authentication', 'programResolve', 'userResolve', 'CoursesService', 'Notification', 'GroupsService', 'CourseProgramsService', '$translate', 'localStorageService', '$q', '_'];

  function ProgramIntroController($scope, $state, $window, ProgramMembersService, Authentication, program, user, CourseProgramsService, Notification, GroupsService, UsersService, $translate, localStorageService, $q, _) {
    var vm = this;
    vm.register = register;
    vm.program = program;
    vm.user = user;

    vm.member = ProgramMembersService.byUserAndProgram({
      programId: vm.program._id,
      userId: localStorageService.get('userId')
    }, function(data) {}, function() {
      vm.member = null;
    });


    function register() {
      if (vm.member)
        return;
      if (vm.program.status !== 'available') {
        UIkit.modal.alert($translate.instant('ERROR.PROGRAM_REGISTER.UNAVAILABLE'));
        return;
      }
      if (!vm.program.enrollStatus) {
        UIkit.modal.alert($translate.instant('ERROR.PROGRAM_REGISTER.ENROLL_UNAVAILABLE'));
        return;
      }

      if (vm.program.enrollPolicy !== 'open') {
        UIkit.modal.alert($translate.instant('ERROR.PROGRAM_REGISTER.ENROLL_RESTRICTED'));
        return;
      }

      var member = new ProgramMembersService();
      member.program = vm.program._id;
      member.member = vm.user._id;
      member.registerAgent = vm.user._id;
      member.status = 'active';
      member.enrollmentStatus = 'registered';
      member.role = 'student';
      member.registered = new Date();
      member.$save(function() {
        Notification.success({
          message: '<i class="uk-icon-check"></i> Member ' + member.user.displayName + 'enroll successfully!'
        });
        $window.location.reload();
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Member ' + user.displayName + 'failed to enroll successfully!'
        });
      });
    }


  }
}(window.UIkit));
