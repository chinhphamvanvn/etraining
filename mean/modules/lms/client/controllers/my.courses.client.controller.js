(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('MyCoursesListController', MyCoursesListController);

MyCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification', 'CourseMembersService', '$q', 'GroupsService','_'];

function MyCoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, CourseMembersService,$q ,GroupsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.members = CourseMembersService.me(function() {
        _.each(vm.members,function(member) {
           // member.course.percentage = 50;
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