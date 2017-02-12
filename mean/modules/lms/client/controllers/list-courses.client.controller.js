(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesListController', CoursesListController);

CoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification', 'GroupsService', '$q','_'];

function CoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, GroupsService,$q, _) {
    var vm = this;
    vm.groups = GroupsService.listCourseGroup(function() {
        _.each(vm.groups,function(group) {
            group.courses = CoursesService.byGroup({groupId:group._id});
        })
    });
    vm.selectGroup = selectGroup;
    vm.selectCourse = selectCourse;
    
    function selectGroup(group) {
        group.courses = CoursesService.byGroup({groupId:group._id});
    }
    
    function selectCourse(course) {
        vm.selectedCourse = course;
    }
}
}());