(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStudentClassroomController', CoursesStudentClassroomController);

  CoursesStudentClassroomController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'classroomResolve', 'Notification', 'CourseMembersService', '$translate', '_'];

  function CoursesStudentClassroomController($scope, $state, $window, Authentication, $timeout, edition, course, member, classroom, Notification, CourseMembersService, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.classroom = classroom;
    vm.joinConference = joinConference;
    if (vm.classroom.teacher)
      vm.classroom.teacher= CourseMembersService.get({memberId: vm.classroom.teacher});

    CourseMembersService.byClass({
      classroomId: vm.classroom._id
    }, function(members) {
      vm.members = members;
    });
    
    function joinConference(classroom) {
      if (!vm.classroom.teacher || !vm.classroom.teacher._id) {
        UIkit.error($translate.instant('ERROR.CONFERENCE.TEACHER_NOT_FOUND'));
        return;
      }
      $state.go('conference',{classroomId:vm.classroom._id, memberId: vm.member._id});
    }
  }
}());
