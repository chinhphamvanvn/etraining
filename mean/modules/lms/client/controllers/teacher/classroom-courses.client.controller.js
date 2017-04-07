(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesTeacherClassroomController', CoursesTeacherClassroomController);

  CoursesTeacherClassroomController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'Notification', 'ClassroomsService', 'ConferencesService', '$translate', 'CourseMembersService', 'ConferenceParticipantsService', '_'];

  function CoursesTeacherClassroomController($scope, $state, $window, Authentication, $timeout, edition, course, member, Notification, ClassroomsService, ConferencesService, $translate, CourseMembersService, ConferenceParticipantsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.selectClass = selectClass;
    vm.createConference = createConference;
    vm.addConferenceMember = addConferenceMember;
    vm.removeConferenceMember = removeConferenceMember;


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
        vm.members = [vm.member];
        CourseMembersService.byClass({
          classroomId: vm.classroomId
        }, function(members) {
          vm.members = vm.members.concat(members);
          _.each(vm.members, function(member) {
            ConferenceParticipantsService.byMember({
              memberId: member._id
            }, function(conferenceMember) {
              if (!conferenceMember._id)
                member.conferenceMember = null;
              else
                member.conferenceMember = conferenceMember;
            }, function() {
              member.conferenceMember = null;
            });
          });
        });
        vm.conference = ConferencesService.byClass({
          classroomId: vm.classroom._id
        }, function() {}, function() {
          vm.conference = null;
        });
      }
    }

    function createConference() {
      var now = new Date();
      var startDate = vm.classroom.startDate ? new Date(vm.classroom.startDate) : null;
      var endDate = vm.classroom.endDate ? new Date(vm.classroom.endDate) : null;
      if (now.getTime() > endDate.getTime()) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_CONFERENCE.EXPIRED'));
        return;
      }
      if (now.getTime() < startDate.getTime()) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE_CONFERENCE.NOT_STARTED'));
        return;
      }
      vm.conference = new ConferencesService();
      vm.conference.name = vm.course.name + '-' + vm.classroom.name;
      vm.conference.classroom = vm.classroom._id;
      vm.conference.$save(function() {
        console.log(vm.conference);
      }, function() {
        vm.conference = null;
      });
    }

    function addConferenceMember(member) {
      var participant = new ConferenceParticipantsService();
      participant.name = member.member.displayName;
      participant.email = member.member.email;
      participant.member = member._id;
      participant.meetingId = vm.conference.meetingId;
      participant.conference = vm.conference._id;
      participant.isPresenter = member.role === 'teacher';
      participant.$save(function() {
        member.conferenceMember = participant;
      }, function() {
        member.conferenceMember = null;
      });
    }

    function removeConferenceMember(member) {
      member.conferenceMember.$remove(function() {
        member.conferenceMember = null;
      }, function() {});
    }
  }
}(window.UIkit));
