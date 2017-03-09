(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudentClassroomController', CoursesStudentClassroomController);

CoursesStudentClassroomController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve','memberResolve','classroomResolve', 'Notification', 'CourseMembersService', 'ConferencesService','ConferenceParticipantsService','$translate', '_'];

function CoursesStudentClassroomController($scope, $state, $window, Authentication, $timeout, edition, course, member,classroom, Notification, CourseMembersService ,ConferencesService,ConferenceParticipantsService ,$translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.classroom = classroom;
   
    vm.conference = ConferencesService.byClass({classroomId:vm.classroom._id},function() {
        var now = new Date();
        var start = new Date(vm.classroom.startDate);
        var end = new Date(vm.classroom.endDate);
        if (now.getTime() > end.getTime())  {
            vm.alert = $translate.instant('ERROR.COURSE_CONFERENCE.EXPIRED');
            return;
        }
        if (now.getTime() < start.getTime()) { 
            vm.alert = $translate.instant('ERROR.COURSE_CONFERENCE.NOT_STARTED');
            return;
        }
        ConferenceParticipantsService.byConference({conferenceId:vm.conference._id},function(participants) {
            vm.participants = participants;
            vm.participant = _.find(participants,function(p) {
                return p.member == vm.member._id;
            })
        });
    },function() {
        vm.alert = $translate.instant('ERROR.COURSE_CONFERENCE.UNAVAILABLE');
    });
    
    
}
}());