(function() {
  'use strict';

  // Programs controller
  angular
    .module('lms')
    .controller('MyProgramsListController', MyProgramsListController);

  MyProgramsListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'localStorageService', 'CourseProgramsService', 'Notification', 'AttemptsService', 'EditionSectionsService', 'ProgramMembersService', 'programUtils', '$q', '_'];

  function MyProgramsListController($scope, $state, $window, Authentication, $timeout, localStorageService, CourseProgramsService, Notification, AttemptsService, EditionSectionsService, ProgramMembersService, programUtils, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.members = ProgramMembersService.byUser({
      userId: localStorageService.get('userId')
    }, function() {
      _.each(vm.members, function(member) {
        if (member.enrollmentStatus === 'registered')
          member.program.percentage = 0;
        if (member.enrollmentStatus === 'completed')
          member.program.percentage = 100;
        CourseProgramsService.get({programId:member.program._id},function(program) {
          programUtils.memberProgress(member, program).then(function(progress) {
            member.program.percentage = progress.completePercentage;
          });
        });        
      });
    });
    vm.unenroll = unenroll;

    function unenroll(member) {
      member.$withdraw(function(response) {
        Notification.success({
          message: '<i class="uk-icon-ok"></i> Member withdrawn successfully!'
        });
        $window.location.reload();
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Member withdraw  error!'
        });
      });
    }
  }
}());
