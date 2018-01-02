(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesIntroController', CoursesIntroController);

  CoursesIntroController.$inject = ['$scope', '$state', '$window', 'CourseMembersService', 'Authentication', 'ClassroomsService', 'courseResolve', 'editionResolve', 'userResolve', 'CoursesService', 'Notification', 'GroupsService', 'UsersService', '$translate', 'localStorageService', '$q', '_'];

  function CoursesIntroController($scope, $state, $window, CourseMembersService, Authentication, ClassroomsService, course, edition, user, CoursesService, Notification, GroupsService, UsersService, $translate, localStorageService, $q, _) {
    var vm = this;
    vm.register = register;
    vm.course = course;
    vm.edition = edition;
    vm.user = user;

    vm.classes = ClassroomsService.byCourse({
      courseId: vm.course._id
    });
    vm.member = CourseMembersService.byUserAndCourse({
      courseId: vm.course._id,
      userId: localStorageService.get('userId')
    }, function(data) {}, function() {
      vm.member = null;
    });


    function register() {
      if (vm.member)
        return;
      if (vm.course.status !== 'available') {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.UNAVAILABLE'));
        return;
      }
      if (!vm.course.enrollStatus) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.ENROLL_UNAVAILABLE'));
        return;
      }
      var now = new Date();
      var startDate = vm.course.startDate ? new Date(vm.course.startDate) : null;
      var endDate = vm.course.endDate ? new Date(vm.course.endDate) : null;
      var enrollStartDate = vm.course.enrollStartDate ? new Date(vm.course.enrollStartDate) : null;
      var enrollEndDate = vm.course.enrollEndDate ? new Date(vm.course.enrollEndDate) : null;
      if (endDate && now.getTime() > endDate.getTime()) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.EXPIRED'));
        return;
      }
      if (enrollStartDate && now.getTime() < enrollStartDate.getTime()) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.ENROLL_NOT_STARTED'));
        return;
      }
      if (enrollEndDate && now.getTime() > enrollEndDate.getTime()) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.ENROLL_EXPIRED'));
        return;
      }

      if (vm.course.enrollPolicy !== 'open') {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.ENROLL_RESTRICTED'));
        return;
      }

      var classroom = _.find(vm.classes, function(classroom) {
        var now = new Date();
        var startDate = classroom.startDate ? new Date(classroom.startDate) : null;
        var endDate = classroom.endDate ? new Date(classroom.endDate) : null;
        if (startDate && now.getTime() < startDate.getTime())
          return false;
        if (endDate && now.getTime() > endDate.getTime())
          return false;
        return true;
      });
      if (vm.course.model === 'group' && !classroom) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_REGISTER.CLASS_UNAVAILABLE'));
        return;
      }
      var member = new CourseMembersService();
      member.course = vm.course._id;
      member.member = vm.user._id;
      if (vm.course.model === 'group')
        member.classroom = classroom._id;
      member.registerAgent = vm.user._id;
      member.edition = vm.edition._id;
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
