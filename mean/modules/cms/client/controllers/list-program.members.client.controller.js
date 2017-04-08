(function(UIkit) {
  'use strict';


  angular
    .module('cms')
    .controller('ProgramMembersController', ProgramMembersController);

  ProgramMembersController.$inject = ['$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', 'programResolve', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Notification', '$q', 'ProgramMembersService', '$translate', 'treeUtils', '_'];

  function ProgramMembersController($scope, $state, $filter, $compile, Authentication, AdminService, program, $location, $window, DTOptionsBuilder, DTColumnDefBuilder, Notification, $q, ProgramMembersService, $translate, treeUtils, _) {
    var vm = this;
    vm.selectStudentGroup = selectStudentGroup;
    vm.selectManagerGroup = selectManagerGroup;
    vm.selectManagers = selectManagers;
    vm.selectStudents = selectStudents;
    vm.program = program;
    vm.remove = remove;
    vm.displayUsers = [];

    ProgramMembersService.byProgram({
      programId: vm.program._id
    }, function(data) {
      vm.managers = _.filter(data, function(item) {
        return item.role === 'manager' && item.member;
      });
      vm.students = _.filter(data, function(item) {
        return item.role === 'student' && item.member;
      });
    });

    function selectStudentGroup(groups) {
      vm.studentUsers = [];
      _.each(groups, function(group) {
        AdminService.byGroup({
          groupId: group
        }, function(users) {
          vm.studentUsers = vm.studentUsers.concat(users);
        });
      });
    }

    function selectManagerGroup(groups) {
      vm.managerUsers = [];
      _.each(groups, function(group) {
        AdminService.byGroup({
          groupId: group
        }, function(users) {
          vm.managerUsers = vm.managerUsers.concat(users);
        });
      });
    }

    function remove(member) {
      UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        member.$remove(function() {
          if (member.role === 'manager')
            vm.managers = _.reject(vm.managers, function(item) {
              return item._id === member._id;
            });
          if (member.role === 'student')
            vm.students = _.reject(vm.students, function(item) {
              return item._id === member._id;
            });
        });
      });
    }

    function selectManagers() {
      var users = _.filter(vm.managerUsers, function(user) {
        return user.selectedAsManager;
      });
      _.each(users, function(user) {
        var exist = _.find(vm.managers, function(manager) {
          return manager.member._id === user._id && manager.status === 'active';
        });
        if (!exist) {
          var member = new ProgramMembersService();
          member.member = user._id;
          member.registerAgent = Authentication.user._id;
          member.program = vm.program._id;
          member.status = 'active';
          member.role = 'manager';
          member.registered = new Date();
          member.$save(function() {
            vm.managers.push(member);
          });
        }
      });
    }

    function selectStudents() {
      var users = _.filter(vm.studentUsers, function(user) {
        return user.selectedAsStudent;
      });
      _.each(users, function(user) {
        var exist = _.find(vm.students, function(student) {
          return student.member._id === user._id && student.status === 'active';
        });
        // if program is self-study, then allow single enrollment per user
        if (!exist) {
          var member = new ProgramMembersService();
          member.program = vm.program._id;
          member.member = user._id;
          member.registerAgent = Authentication.user._id;
          member.status = 'active';
          member.enrollmentStatus = 'registered';
          member.role = 'student';
          member.registered = new Date();
          member.$save(function() {
            Notification.success({
              message: '<i class="uk-icon-check"></i> Member ' + user.displayName + 'enroll successfully!'
            });
            vm.students.push(member);
          }, function(errorResponse) {
            Notification.error({
              message: errorResponse.data.message,
              title: '<i class="uk-icon-ban"></i> Member ' + user.displayName + 'failed to enroll successfully!'
            });
          });
        }
      });
    }
  }
}(window.UIkit));
