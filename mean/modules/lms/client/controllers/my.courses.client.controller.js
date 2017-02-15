(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('MyCoursesListController', MyCoursesListController);

MyCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification','CourseAttemptsService','EditionSectionsService','CourseEditionsService', 'CourseMembersService', '$q', 'GroupsService','_'];

function MyCoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, CourseAttemptsService,EditionSectionsService, CourseEditionsService, CourseMembersService,$q ,GroupsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.members = CourseMembersService.me(function() {
        _.each(vm.members,function(member) {
            if (member.enrollmentStatus=='registered')
                member.course.percentage = 0;
            if (member.enrollmentStatus =='completed')
                member.course.percentage = 100;
            if (member.enrollmentStatus =='in-study') {
                CourseEditionsService.byCourse({courseId:member.course._id},function(edition) {
                    var sections = EditionSectionsService.byEdition({editionId:edition._id}, function() {
                        var attempts = CourseAttemptsService.byCourseAndMember({editionId:edition._id,memberId:member._id},function() {
                            var total =0;
                            var complete = 0;
                            _.each(sections,function(section) {
                                if (section.hasContent) {
                                    var read = _.find(attempts,function(attempt) {
                                        return attempt.section == section._id && attempt.status=='completed';
                                    });
                                    total++;
                                    if (read)
                                        complete++;
                                }
                            });
                            member.course.percentage = complete * 100 / total;
                        });
                    });
                });
                
                
            }
            if (member.course.group)
                member.course.group = GroupsService.get({groupId:member.course.group});
             var allPromise = [];
           _.each(member.course.prequisites,function(courseId) {
               allPromise.push(CoursesService.get({courseId:courseId}).$promise);
           });
           $q.all(allPromise).then(function(prequisites) {
               member.course.prequisites = prequisites;
           })
        })
    });
    vm.unenroll = unenroll;
    
    function unenroll(member) {
        member.status = 'withdrawn';
        member.$update(function (response) {
            Notification.success({ message: '<i class="uk-icon-ok"></i> Member withdrawn successfully!' });
            $window.location.reload();
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Member withdraw  error!' });
         });
    }
}
}());