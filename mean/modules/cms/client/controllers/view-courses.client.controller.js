(function() {
    'use strict';

// Courses controller
angular
    .module('cms')
    .controller('CourseViewController', CourseViewController);

CourseViewController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'CoursesService', 'Notification', 'GroupsService', 'Upload', '$q','_'];

function CourseViewController($scope, $state, $window, Authentication, $timeout, course, CoursesService, Notification, GroupsService,Upload ,$q, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.course = course;


}
}());