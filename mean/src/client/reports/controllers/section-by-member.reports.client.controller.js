(function() {
  'use strict';

  angular
    .module('reports')
    .controller('SectionByMemberReportsController', SectionByMemberReportsController);

  SectionByMemberReportsController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'GroupsService', 'AdminService', 'CoursesService', 'CourseMembersService', 'EditionSectionsService', 'AttemptsService', '$timeout', '$window', '$translate', 'treeUtils', '_'];

  function SectionByMemberReportsController($scope, $rootScope, $state, Authentication, GroupsService, AdminService, CoursesService, CourseMembersService, EditionSectionsService, AttemptsService, $timeout, $window, $translate, treeUtils, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.generateReport = generateReport;
    vm.getExportData = getExportData;
    vm.getExportHeader = getExportHeader;

    function generateReport(users) {
      vm.sections = [];
      _.each(users, function(user) {
        CourseMembersService.byUser({
          userId: user._id
        }, function(members) {
          members = _.filter(members, function(member) {
            return member.role === 'student';
          });
          _.each(members, function(member) {
            if (member.edition) {
              var attemps = AttemptsService.byMember({
                memberId: member._id
              }, function() {
                var sections = EditionSectionsService.byEdition({
                  editionId: member.edition._id
                }, function() {
                  _.each(sections, function(section) {
                    var sectionAttemps = _.filter(attemps, function(attempt) {
                      return attempt.section._id === section._id;
                    });
                    if (sectionAttemps && sectionAttemps.length > 0) {
                      section.member = member;
                      section.lastAttempt = _.max(sectionAttemps, function(attempt) {
                        return new Date(attempt.start).getTime();
                      });
                      section.firstAttempt = _.min(sectionAttemps, function(attempt) {
                        return new Date(attempt.start).getTime();
                      });
                      section.completed = _.find(sectionAttemps, function(attempt) {
                        return attempt.status === 'completed';
                      });
                      vm.sections.push(section);
                    }
                  });
                });
              });
            }
          });
        });
      });
    }


    function getExportData() {
      var data = [];
      _.each(vm.sections, function(section) {
        data.push({
          username: section.member.member.username,
          firstName: section.member.member.firstName,
          lastName: section.member.member.lastName,
          code: section.member.course.code,
          name: section.member.course.name,
          enrollStatus: section.member.enrollmentStatus,
          type: section.contentType,
          sectionName: section.name,
          firstAttempt: moment(new Date(section.firstAttempt.created)).format('DD/MM/YYYY'),
          lastAttempt: moment(new Date(section.lastAttempt.created)).format('DD/MM/YYYY'),
          completed: section.completed ? $translate.instant('COMMON.ATTEMPT_STATUS.INITIAL') : $translate.instant('COMMON.ATTEMPT_STATUS.COMPLETE')
        });
      });
      return data;
    }


    function getExportHeader() {
      return [
        $translate.instant('MODEL.USER.USERNAME'),
        $translate.instant('MODEL.USER.FIRST_NAME'),
        $translate.instant('MODEL.USER.LAST_NAME'),
        $translate.instant('MODEL.COURSE.CODE'),
        $translate.instant('MODEL.COURSE.NAME'),
        $translate.instant('MODEL.MEMBER.ENROLL_STATUS'),
        $translate.instant('MODEL.SECTION.CONTENT_TYPE'),
        $translate.instant('MODEL.SECTION.NAME'),
        $translate.instant('REPORT.SECTION_BY_MEMBER.FIRST_ATTEMPT'),
        $translate.instant('REPORT.SECTION_BY_MEMBER.LAST_ATTEMPT'),
        $translate.instant('REPORT.SECTION_BY_MEMBER.STATUS')
      ];
    }

  }
}());
