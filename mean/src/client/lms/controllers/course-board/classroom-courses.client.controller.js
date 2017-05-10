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

    CourseMembersService.byClass({
      classroomId: vm.classroom._id
    }, function(members) {
      vm.members = members;
    });
  }


}());
