(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('LmsCoursesListController', LmsCoursesListController);

LmsCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification', 'GroupsService', '$q','_'];

function LmsCoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, GroupsService,$q, _) {
    var vm = this;
    vm.groups = GroupsService.listCourseGroup(function() {
        _.each(vm.groups,function(group) {
            group.courses = CoursesService.byGroup({groupId:group._id});
        })
    });
    vm.selectGroup = selectGroup;
    vm.selectCourse = selectCourse;
    
    function selectGroup(group) {
        CoursesService.byGroup({groupId:group._id},function(courses) {
            group.courses = _.filter(courses,function(course) {
                return course.status =='available' && course.enrollStatus && course.displayMode !='enroll'
            })
        });
    }
    
    function selectCourse(course) {
        vm.selectedCourse = course;
    }
}
}());