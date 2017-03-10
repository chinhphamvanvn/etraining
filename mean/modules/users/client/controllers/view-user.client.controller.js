(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserViewController', UserViewController);

  UserViewController.$inject = ['$scope', '$state', '$timeout', '$rootScope','$window','userResolve', 'Authentication', 'Notification', 'UsersService','CourseMembersService', 'UserLogsService', 'GroupsService','CertificatesService', 'CourseEditionsService','EditionSectionsService','AttemptsService','CompetencyAchievementsService', 'treeUtils','courseUtils', '_', '$translate'];

  function UserViewController($scope, $state, $timeout, $rootScope, $window, user, Authentication, Notification, UsersService, CourseMembersService, UserLogsService, GroupsService, CertificatesService, CourseEditionsService, EditionSectionsService, AttemptsService,CompetencyAchievementsService, treeUtils,courseUtils,  _,$translate) {
    var vm = this;
    vm.authentication = Authentication;    
    vm.user = user;
    vm.edit = edit;
    if ($rootScope.viewerRole=='admin') 
        vm.logs = UserLogsService.userLogsByAdmin({userId:vm.user._id});
    else
        vm.logs = UserLogsService.userLogs({userId:vm.user._id});
    vm.members = [];
    vm.certificates = [];
    vm.skills  = CompetencyAchievementsService.byUser({achiever:vm.user._id});
    vm.memberListCsv = [];
    vm.headerArrCsv = [$translate.instant("MODEL.COURSE.NAME"), $translate.instant("MODEL.MEMBER.REGISTER_DATE"), $translate.instant("MODEL.MEMBER.STATUS"), $translate.instant("MODEL.MEMBER.ENROLL_STATUS"), $translate.instant("COMMON.PROGRESS_PERCENTAGE"), $translate.instant("COMMON.TIME_SPEND")];
    function edit() {
       if ($rootScope.viewerRole=='admin') 
           $state.go('admin.workspace.users.edit', {userId:vm.user._id});
       else
           $state.go('workspace.users.edit');
    }

    function toTimeString(seconds){
        function pad(num) {
            return ("0"+num).slice(-2);
        }
        var hh = Math.floor(seconds / 3600);
        var mm = Math.floor((seconds - hh*3600 ) /60);
        var ss = Math.floor(seconds - hh*3600 - mm* 60);
        var result =  pad(hh)+"hr : "+pad(mm)+"m : "+pad(ss)+"s";
        return result;
    }


    vm.members = CourseMembersService.byUser({userId:vm.user._id},function() {
        vm.members = _.filter(vm.members,function(member) {
            return member.role =='student';
        });
        vm.courseCount = vm.members.length;
        _.each(vm.members,function(member) {
            member.timeSpent = 0;
            member.percentage = 0;
            CertificatesService.byMember({memberId:member._id},function(certificate) {
                vm.certificates.push( certificate);
            });
            courseUtils.memberProgress(member._id,member.edition).then(function(percentage) {
                member.percentage = percentage;
                courseUtils.memberTime(member._id).then(function(time) {
                    member.timeSpent = time;
                    var memberCsv = {
                        name: member.course.name,
                        registered: member.registered,
                        status: member.status,
                        enrollmentStatus: member.enrollmentStatus,
                        percentage: member.percentage + " %",
                        timeSpent: toTimeString(member.timeSpent)
                    };
                    vm.memberListCsv.push(memberCsv);
                });
            });
        });
    });
  }
}());
