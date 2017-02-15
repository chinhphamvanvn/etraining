(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesForumController', CoursesForumController);

CoursesForumController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout','courseResolve','memberResolve', 'Notification', 'CourseEditionsService', 'ForumsService','$translate', '_'];

function CoursesForumController($scope, $state, $window, Authentication, $timeout, course, member, Notification, CourseEditionsService,ForumsService ,$translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.member = member;
    vm.createForum =  createForum;
    vm.forum = ForumsService.byCourse({courseId:vm.course._id},function() {
        
    },function() {
        vm.alert = $translate.instant('ERROR.COURSE_FORUM_UNAVAILABLE');
    })
    
    function createForum() {
        var forum = new ForumsService();
        forum.course = vm.course._id;
        forum.name = vm.course.name;
        forum.$save(function() {
            $window.location.reload();
        },function(errorResponse) {
            Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum activation  error!' });
        })
    }
    
}
}());