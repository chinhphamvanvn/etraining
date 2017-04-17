(function() {
  'use strict';

  angular
    .module('reports')
    .controller('MemberByCourseReportsController', MemberByCourseReportsController);

  MemberByCourseReportsController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'GroupsService', 'CoursesService', 'CourseMembersService', 'AttemptsService', '$timeout', '$window', '$translate', 'courseUtils', 'treeUtils', '_'];

  function MemberByCourseReportsController($scope, $rootScope, $state, Authentication, GroupsService, CoursesService, CourseMembersService, AttemptsService, $timeout, $window, $translate, courseUtils, treeUtils, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.generateReport = generateReport;
    vm.getExportHeader = getExportHeader;

    vm.summary = {
      toalMember: 0,
      totalRegisterMember: 0,
      percentRegisterMember: 0,
      totalInstudyMember: 0,
      percentInstudyMember: 0,
      totalCompleteMember: 0,
      percentCompleteMember: 0,
      time: 0
    };

    function generateReport(courses) {
      vm.courses = courses;
      _.each(courses, function(course) {
        CourseMembersService.byCourse({
          courseId: course._id
        }, function(members) {
          members = _.filter(members, function(member) {
            return member.role === 'student';
          });
          course.toalMember = members.length;
          course.totalRegisterMember = _.filter(members, function(member) {
            return member.enrollmentStatus === 'registered';
          }).length;
          course.totalRegisterMember = _.filter(members, function(member) {
            return member.enrollmentStatus === 'registered';
          }).length;
          course.percentRegisterMember = course.toalMember ? Math.floor(course.totalRegisterMember * 100 / course.toalMember) : 0;
          course.totalInstudyMember = _.filter(members, function(member) {
            return member.enrollmentStatus === 'in-study';
          }).length;
          course.percentInstudyMember = course.toalMember ? Math.floor(course.totalInstudyMember * 100 / course.toalMember) : 0;
          course.totalCompleteMember = _.filter(members, function(member) {
            return member.enrollmentStatus === 'completed';
          }).length;
          course.percentCompleteMember = course.toalMember ? Math.floor(course.totalCompleteMember * 100 / course.toalMember) : 0;
          vm.summary.toalMember += course.toalMember;
          vm.summary.totalRegisterMember += course.totalRegisterMember;
          vm.summary.percentRegisterMember = Math.floor(vm.summary.totalRegisterMember * 100 / vm.summary.toalMember);
          vm.summary.totalInstudyMember += course.totalInstudyMember;
          vm.summary.percentInstudyMember = Math.floor(vm.summary.totalInstudyMember * 100 / vm.summary.toalMember);
          vm.summary.totalCompleteMember += course.totalCompleteMember;
          vm.summary.percentCompleteMember = Math.floor(vm.summary.totalCompleteMember * 100 / vm.summary.toalMember);
          courseUtils.courseTime(course).then(function(time) {
            vm.summary.time += time;
            course.time = time;
          });
        });
      });
    }

    function getExportHeader() {
      return [
        $translate.instant('MODEL.COURSE.CODE'),
        $translate.instant('MODEL.COURSE.NAME'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.TOTAL'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.REGISTERED') + $translate.instant('COMMON.TOTAL'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.REGISTERED') + $translate.instant('COMMON.PERCENTAGE'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.INSTUDY') + $translate.instant('COMMON.TOTAL'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.INSTUDY') + $translate.instant('COMMON.PERCENTAGE'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.COMPLETED') + $translate.instant('COMMON.TOTAL'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.COMPLETED') + $translate.instant('COMMON.PERCENTAGE'),
        $translate.instant('REPORT.MEMBER_BY_COURSE.TIME')
      ];
    }
  }
}());
