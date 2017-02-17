(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesGradeboardController', CoursesGradeboardController);

CoursesGradeboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve','memberResolve','gradeResolve', 'Notification', 'CourseEditionsService', 'CourseMembersService','$translate', '_'];

function CoursesGradeboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, Notification, CourseEditionsService,CourseMembersService ,$translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.member = member;
    vm.members = CourseMembersService.byCourse({courseId:vm.course._id},function() {
        vm.members = _.filter(vm.members,function(m) {
            return m.role=='student';
        })
    } );
    vm.gradescheme = gradescheme;
}
}());