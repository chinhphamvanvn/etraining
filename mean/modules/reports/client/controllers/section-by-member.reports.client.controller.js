(function () {
  'use strict';

  angular
    .module('reports')
    .controller('SectionByMemberReportsController', SectionByMemberReportsController);

  SectionByMemberReportsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'GroupsService','AdminService', 'CoursesService','CourseMembersService','EditionSectionsService', 'CourseAttemptsService','$timeout', '$window','$translate', 'treeUtils','_'];
  
  function SectionByMemberReportsController($scope, $rootScope, $state, Authentication,GroupsService,AdminService, CoursesService,CourseMembersService, EditionSectionsService, CourseAttemptsService, $timeout,$window,$translate, treeUtils,_) {
    var vm = this;
    vm.authentication = Authentication;
    vm.generateReport = generateReport;
    vm.getExportData = getExportData;
    vm.getExportHeader = getExportHeader;

    function generateReport(users) {
        vm.sections = [];
        _.each(users,function(user) {
            CourseMembersService.byUser({userId:user._id},function(members) {
               _.each(members,function(member) {
                   if (member.edition) {
                       var attemps = CourseAttemptsService.byMember({memberId:member._id},function() {
                           var sections = EditionSectionsService.byEdition({editionId:member.edition},function() {
                               _.each(sections,function(section) {
                                  var sectionAttemps = _.filter(attemps,function(attempt) {
                                      return attempt.section == section._id;
                                  }) ;
                                  if (sectionAttemps && sectionAttemps.length > 0) {
                                      section.member = member;
                                      section.lastAttempt = _.max(sectionAttemps, function(attempt){return new Date(attempt.start).getTime()}); 
                                      section.firstAttempt = _.min(sectionAttemps, function(attempt){return new Date(attempt.start).getTime()});
                                      section.completed = _.find(sectionAttemps,function(attempt) {
                                          return attempt.status=='completed';
                                      }) ;
                                      vm.sections.push(section);
                                  }
                                 
                               });
                           });
                       });
                   }
                   
               }) ;
            });
        });
    }

    
    function getExportData() {
        var data  = []
        _.each(vm.members,function(member) {
            data.push({
                        username:member.member.username,
                        code:member.course ? member.course.code:'',
                        name:member.course? member.course.name :'',
                        model:member.course ? member.course.model:'',
                        registered:moment(new Date(member.registered)).format('DD/MM/YYYY'),
                        firstAttempt:moment(new Date(member.firstAttempt.created)).format('DD/MM/YYYY'),
                        lastAttempt:moment(new Date(member.lastAttempt.created)).format('DD/MM/YYYY'),
                        enrollmentStatus:member.enrollmentStatus,
                        score:member.score,
                        time:member.time})
        });
        return data;
    }
    
    
    function getExportHeader() {
        return [
                $translate.instant('MODEL.USER.USERNAME'),
                $translate.instant('MODEL.COURSE.CODE'),
                $translate.instant('MODEL.COURSE.NAME'),
                $translate.instant('MODEL.COURSE.MODEL'),
                $translate.instant('REPORT.COURSE_BY_MEMBER.REGISTER_DATE'),
                $translate.instant('REPORT.COURSE_BY_MEMBER.FIRST_ATTEMPT'),
                $translate.instant('REPORT.COURSE_BY_MEMBER.LAST_ATTEMPT'),
                $translate.instant('MODEL.MEMBER.ENROLL_STATUS'),
                $translate.instant('REPORT.COURSE_BY_MEMBER.SCORE'),
                $translate.instant('REPORT.COURSE_BY_MEMBER.TIME'),
                ];
    }
   
  }
}());
