(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('MyCoursesListController', MyCoursesListController);

MyCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification', 'CourseMembersService', 'Upload', 'fileManagerConfig','_'];

function MyCoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, CourseMembersService,Upload ,fileManagerConfig, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.members = CourseMembersService.me();
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