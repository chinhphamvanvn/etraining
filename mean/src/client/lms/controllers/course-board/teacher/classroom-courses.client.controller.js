(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesTeacherClassroomController', CoursesTeacherClassroomController);

  CoursesTeacherClassroomController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'Notification', 'ClassroomsService', '$translate', 'CourseMembersService', '_'];

  function CoursesTeacherClassroomController($scope, $state, $window, Authentication, $timeout, edition, course, member, Notification, ClassroomsService, $translate, CourseMembersService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.selectClass = selectClass;
    vm.joinConference = joinConference;

    vm.classConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };
    vm.classOptions = [];

    vm.classes = ClassroomsService.byCourse({
      courseId: vm.course._id
    }, function() {
      vm.classOptions = _.map(vm.classes, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
      _.each(vm.classes, function(classroom) {
        if (classroom.teacher) {
          classroom.teacher = CourseMembersService.get({memberId: classroom.teacher});
        }
        var now = new Date();
        var startDate = classroom.startDate ? new Date(classroom.startDate) : null;
        var endDate = classroom.endDate ? new Date(classroom.endDate) : null;
        if (startDate) {
          if (startDate.getTime() > now.getTime())
            classroom.titleClass = 'uk-text-warning';
          else if (endDate) {
            if (endDate.getTime() > now.getTime())
              classroom.titleClass = 'uk-text-success';
            else
              classroom.titleClass = '';
          } else
            classroom.titleClass = 'uk-text-success';
        } else {
          if (endDate) {
            if (endDate.getTime() > now.getTime())
              classroom.titleClass = 'uk-text-success';
            else
              classroom.titleClass = '';
          } else
            classroom.titleClass = '';
        }
      });
    });

    function selectClass() {
      if (vm.classroomId) {
        vm.classroom = _.find(vm.classes, function(obj) {
          return obj._id === vm.classroomId;
        });
        vm.members = CourseMembersService.byClass({
          classroomId: vm.classroomId
        });
      }
    }

    function joinConference(classroom) {
      if (classroom.teacher._id !== vm.member._id) {
        UIkit.error($translate.instant('ERROR.CONFERENCE.NOT_TEACHER'));
        return;
      }
      $state.go('conference', {
        classroomId: vm.classroom._id,
        memberId: vm.member._id
      });
    }
  }
}(window.UIkit));
