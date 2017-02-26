(function () {
  'use strict';

  angular
    .module('reports')
    .controller('MemberByCourseReportsController', MemberByCourseReportsController);

  MemberByCourseReportsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'GroupsService', 'CoursesService','CourseMembersService','CourseAttemptsService','$timeout', '$window','$translate', 'treeUtils','_'];
  
  function MemberByCourseReportsController($scope, $rootScope, $state, Authentication,GroupsService, CoursesService,CourseMembersService, CourseAttemptsService, $timeout,$window,$translate, treeUtils,_) {
    var vm = this;
    vm.authentication = Authentication;
    vm.generateReport = generateReport;
    vm.getExportData = getExportData;
    vm.getExportHeader = getExportHeader;
    
    vm.summary = {
            toalMember:0,
            totalRegisterMember:0,
            percentRegisterMember:0,
            totalInstudyMember:0,
            percentInstudyMember:0,
            totalCompleteMember:0,
            percentCompleteMember:0,
            time:0
    }
    
    GroupsService.listCourseGroup( function(groups) {
        var tree = treeUtils.buildGroupTree(groups);
        $timeout(function() {
                $("#courseTree").fancytree({
                    checkbox: true,
                    titlesTabbable: true,
                    selectMode:2,
                    clickFolderMode:3,
                    imagePath: "/assets/icons/others/",
                    autoScroll: true,
                    generateIds: true,
                    source: tree,
                    toggleEffect: { effect: "blind", options: {direction: "vertical", scale: "box"}, duration: 200 },
                    select: function(event, data) {
                        // Display list of selected nodes
                        var selectedGroups = _.map( data.tree.getSelectedNodes(), function(obj) {
                            return obj.data._id;
                        });
                        vm.courses = [];
                        _.each(selectedGroups,function(group) {
                            CoursesService.byGroup({groupId:group},function(courses) {
                                vm.courses = vm.courses.concat(courses)
                            })
                        })
                        $scope.$apply();
                    }
                });
            });
       }); 
    
    
    function generateReport(courses) {

        _.each(courses,function(course) {
            CourseMembersService.byCourse({courseId:course._id},function(members) {
               course.toalMember =  members.length;
               course.totalRegisterMember = _.filter(members,function(member) {
                   return member.enrollmentStatus == 'registered';
               }).length;
               course.totalRegisterMember = _.filter(members,function(member) {
                   return member.enrollmentStatus == 'registered';
               }).length;
               course.percentRegisterMember = course.toalMember ? Math.floor(course.totalRegisterMember*100/course.toalMember) : 0;
               course.totalInstudyMember = _.filter(members,function(member) {
                   return member.enrollmentStatus == 'in-study';
               }).length;
               course.percentInstudyMember = course.toalMember ? Math.floor(course.totalInstudyMember*100/course.toalMember) : 0;
               course.totalCompleteMember = _.filter(members,function(member) {
                   return member.enrollmentStatus == 'completed';
               }).length;
               course.percentCompleteMember = course.toalMember ? Math.floor(course.totalCompleteMember*100/course.toalMember) : 0;
               vm.summary.toalMember += course.toalMember;
               vm.summary.totalRegisterMember += course.totalRegisterMember;
               vm.summary.percentRegisterMember = Math.floor(vm.summary.totalRegisterMember*100 / vm.summary.toalMember);
               vm.summary.totalInstudyMember += course.totalInstudyMember;
               vm.summary.percentInstudyMember = Math.floor(vm.summary.totalInstudyMember*100 / vm.summary.toalMember);
               vm.summary.totalCompleteMember += course.totalCompleteMember;
               vm.summary.percentCompleteMember = Math.floor(vm.summary.totalCompleteMember*100 / vm.summary.toalMember);
               CourseAttemptsService.byCourse({courseId:course._id},function(attempts) {
                   _.each(attempts,function(attempt) {
                       if (attempt.status=='completed') {
                           var start = new Date(attempt.start);
                           var end = new Date(attempt.end);
                           course.time += Math.floor((end.getTime() - start.getTime())/1000);
                       }
                   });
                   vm.summary.time += course.time;
               })
            });
        });
    }

    
    function getExportData() {
        var data  = []
        _.each(vm.selectedCourses,function(course) {
            data.push({
                        code:course.code,
                        name:course.name,
                        toalMember:course.toalMember,
                        totalRegisterMember:course.totalRegisterMember,
                        percentRegisterMember:course.percentRegisterMember,
                        totalInstudyMember:course.totalInstudyMember,
                        percentInstudyMember:course.percentInstudyMember,
                        totalCompleteMember:course.totalCompleteMember,
                        percentCompleteMember:course.percentCompleteMember,
                        time:course.time})
        });
        return data;
    }
    
    function getExportHeader() {
        return [
                $translate.instant('MODEL.COURSE.CODE'),
                $translate.instant('MODEL.COURSE.NAME'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.TOTAL'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.REGISTERED')+ $translate.instant('COMMON.TOTAL'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.REGISTERED')+ $translate.instant('COMMON.PERCENTAGE'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.INSTUDY')+ $translate.instant('COMMON.TOTAL'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.INSTUDY')+ $translate.instant('COMMON.PERCENTAGE'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.COMPLETED')+ $translate.instant('COMMON.TOTAL'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.MEMBER') + $translate.instant('COMMON.ENROLL.COMPLETED')+ $translate.instant('COMMON.PERCENTAGE'),
                $translate.instant('REPORT.MEMBER_BY_COURSE.TIME')
                ];
    }
   
  }
}());
