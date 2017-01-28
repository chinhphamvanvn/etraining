(function() {
    'use strict';

// Courses controller
angular
    .module('cms')
    .controller('CourseViewController', CourseViewController);

CourseViewController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'CoursesService', 'Notification', 'GroupsService', 'Upload', 'fileManagerConfig','_'];

function CourseViewController($scope, $state, $window, Authentication, $timeout, course, CoursesService, Notification, GroupsService,Upload ,fileManagerConfig, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.course = course;
    if (vm.course.group)
        vm.group = GroupsService.get({groupId:vm.course.group});
   vm.prequisites = [];
   _.each(vm.course.prequisites,function(course) {
       vm.prequisites.push(CoursesService.get({courseId:course}))
   });

}
}());