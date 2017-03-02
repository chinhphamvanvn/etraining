(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('singleMemberProgressReport', ['AttemptsService','CourseMembersService','EditionSectionsService','$translate',  '_', singleMemberProgressReport]);

  function singleMemberProgressReport(AttemptsService,CourseMembersService, EditionSectionsService,$translate, _) {
      
      return {
          scope: {
              course:"=",
          },
          templateUrl:'/modules/lms/client/directives/single-member-progress-report/single-member-progress-report.directive.client.view.html',
          link: function (scope, element, attributes) {
              scope.members = [];           
             CourseMembersService.byCourse({courseId:scope.course._id} ,function(members) {
                  scope.members = _.filter(members,function(member) {
                      return member.role=='student';
                  })
              });
             
 
             scope.generateReport = function(users) {
                 scope.sections = [];
                 var attemps = AttemptsService.byMember({memberId:scope.selectedMember._id},function() {
                     var sections = EditionSectionsService.byEdition({editionId:scope.selectedMember.edition},function() {
                         _.each(sections,function(section) {
                            var sectionAttemps = _.filter(attemps,function(attempt) {
                                return attempt.section == section._id;
                            }) ;
                            section.member = scope.selectedMember;
                            if (sectionAttemps && sectionAttemps.length > 0) {
                                section.lastAttempt = _.max(sectionAttemps, function(attempt){return new Date(attempt.start).getTime()}); 
                                section.firstAttempt = _.min(sectionAttemps, function(attempt){return new Date(attempt.start).getTime()});
                                if (_.find(sectionAttemps,function(attempt) {
                                    return attempt.status=='completed';
                                }))
                                    section.attemptStatus = 'completed';
                                else
                                    section.attemptStatus = 'initial';
                                
                            } else
                                section.attemptStatus = 'empty';
                            scope.sections.push(section);
                           
                         });
                     });
                 });
                           
              }

              
              scope.getExportData = function() {
                  var data  = []
                  _.each(scope.sections,function(section) {
                      data.push({
                                  username:section.member.member.username,
                                  firstName:section.member.member.firstName,
                                  lastName:section.member.member.lastName,
                                  code: scope.course.code,
                                  name: scope.course.name,
                                  enrollStatus: section.member.enrollmentStatus,                                
                                  type:section.contentType,
                                  sectionName: section.name,
                                  firstAttempt:moment(new Date(section.firstAttempt.created)).format('DD/MM/YYYY'),
                                  lastAttempt:moment(new Date(section.lastAttempt.created)).format('DD/MM/YYYY'),
                                  completed:section.attemptStatus})
                  });
                  return data;
              }
              
              
              scope.getExportHeader = function () {
                  return [
                          $translate.instant('MODEL.USER.USERNAME'),
                          $translate.instant('MODEL.USER.FIRST_NAME'),
                          $translate.instant('MODEL.USER.LAST_NAME'),
                          $translate.instant('MODEL.COURSE.CODE'),
                          $translate.instant('MODEL.COURSE.NAME'),
                          $translate.instant('MODEL.MEMBER.ENROLL_STATUS'),
                          $translate.instant('MODEL.SECTION.CONTENT_TYPE'),
                          $translate.instant('MODEL.SECTION.NAME'),
                          $translate.instant('REPORT.SINGLE_MEMBER_PROGRESS.FIRST_ATTEMPT'),
                          $translate.instant('REPORT.SINGLE_MEMBER_PROGRESS.LAST_ATTEMPT'),
                          $translate.instant('REPORT.SINGLE_MEMBER_PROGRESS.STATUS')
                          ];
              }
             
              
             
          }
      }
  }
}());
