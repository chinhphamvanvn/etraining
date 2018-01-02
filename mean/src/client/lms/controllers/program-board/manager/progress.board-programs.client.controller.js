(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ProgramProgressboardController', ProgramProgressboardController);

  ProgramProgressboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'programMemberResolve', 'programResolve', 'userResolve', 'Notification', 'ProgramMembersService', 'programUtils', '$q', '$translate', '_'];

  function ProgramProgressboardController($scope, $state, $window, Authentication, $timeout, member, program, user, Notification, ProgramMembersService, programUtils, $q, $translate, _) {
    var vm = this;
    vm.member = member;
    vm.certify = certify;
    vm.user = user;
    vm.program = program;
    vm.members = ProgramMembersService.byProgram({
      programId: vm.program._id
    }, function() {
      vm.members = _.reject(vm.members, function(member) {
        return member.role === 'manager';
      });

      _.each(vm.members, function(member) {
        programUtils.memberProgress(member, vm.program).then(function(progress) {
          member.progress = progress;
        });
      });
    });

    function certify(member) {
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      var progress = member.progress;
      member.$complete({
        teacherId: vm.user._id
      }, function() {
        member.progress = progress;
        modal.hide();
      });
    }
  }
}(window.UIkit));
