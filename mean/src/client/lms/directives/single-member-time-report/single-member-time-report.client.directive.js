(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('singleMemberTimeReport', ['AttemptsService', 'CourseMembersService', 'EditionSectionsService', '$translate', '_', singleMemberTimeReport]);

  function singleMemberTimeReport(AttemptsService, CourseMembersService, EditionSectionsService, $translate, _) {
    return {
      scope: {
        course: '='
      },
      templateUrl: '/src/client/lms/directives/single-member-time-report/single-member-time-report.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.members = [];
        CourseMembersService.byCourse({
          courseId: scope.course._id
        }, function(members) {
          scope.members = _.filter(members, function(member) {
            return member.role === 'student';
          });
        });

        scope.summary = {
          time: 0
        };

        scope.generateReport = function(users) {
          scope.sections = [];
          var attemps = AttemptsService.byMember({
            memberId: scope.selectedMember._id
          }, function() {
            var sections = EditionSectionsService.byEdition({
              editionId: scope.selectedMember.edition
            }, function() {
              _.each(sections, function(section) {
                var sectionAttemps = _.filter(attemps, function(attempt) {
                  return attempt.section === section._id;
                });
                section.member = scope.selectedMember;
                section.time = 0;
                if (sectionAttemps && sectionAttemps.length > 0) {
                  section.lastAttempt = _.max(sectionAttemps, function(attempt) {
                    return new Date(attempt.start).getTime();
                  });
                  section.firstAttempt = _.min(sectionAttemps, function(attempt) {
                    return new Date(attempt.start).getTime();
                  });
                  var completeAttempts = _.filter(sectionAttemps, function(attempt) {
                    return attempt.status === 'completed';
                  });
                  _.each(completeAttempts, function(attempt) {
                    var start = new Date(attempt.start);
                    var end = new Date(attempt.end);
                    section.time += Math.floor((end.getTime() - start.getTime()) / 1000);
                  });
                }
                scope.summary.time += section.time;
                scope.sections.push(section);
              });
            });
          });
        };

        scope.getExportData = function() {
          var data = [];
          _.each(scope.sections, function(section) {
            data.push({
              username: section.member.member.username,
              firstName: section.member.member.firstName,
              lastName: section.member.member.lastName,
              code: scope.course.code,
              name: scope.course.name,
              enrollStatus: section.member.enrollmentStatus,
              type: section.contentType,
              sectionName: section.name,
              firstAttempt: section.firstAttempt ? moment(new Date(section.firstAttempt.created)).format('DD/MM/YYYY') : '',
              lastAttempt: section.lastAttempt ? moment(new Date(section.lastAttempt.created)).format('DD/MM/YYYY') : '',
              time: section.time
            });
          });
          return data;
        };

        scope.getExportHeader = function() {
          return [
            $translate.instant('MODEL.USER.USERNAME'),
            $translate.instant('MODEL.USER.FIRST_NAME'),
            $translate.instant('MODEL.USER.LAST_NAME'),
            $translate.instant('MODEL.COURSE.CODE'),
            $translate.instant('MODEL.COURSE.NAME'),
            $translate.instant('MODEL.MEMBER.ENROLL_STATUS'),
            $translate.instant('MODEL.SECTION.CONTENT_TYPE'),
            $translate.instant('MODEL.SECTION.NAME'),
            $translate.instant('REPORT.SINGLE_MEMBER_TIME.FIRST_ATTEMPT'),
            $translate.instant('REPORT.SINGLE_MEMBER_TIME.LAST_ATTEMPT'),
            $translate.instant('REPORT.SINGLE_MEMBER_TIME.SPEND')
          ];
        };

      }
    };
  }
}());
