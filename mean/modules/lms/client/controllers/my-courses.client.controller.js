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
    
    

}
}());