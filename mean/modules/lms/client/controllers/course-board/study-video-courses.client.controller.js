(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudyVideoController', CoursesStudyVideoController);

CoursesStudyVideoController.$inject = ['$scope', '$state', '$window', 'HtmlsService','ExamsService','VideosService','EditionSectionsService','Authentication','CourseAttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','memberResolve','treeUtils', '$translate', '$q','_'];

function CoursesStudyVideoController($scope, $state, $window, HtmlsService,ExamsService,VideosService,EditionSectionsService, Authentication, CourseAttemptsService,edition, CoursesService, Notification, section,member,treeUtils,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    if (vm.section.video) {
        vm.video = VideosService.get({videoId:vm.section.video},function() {
            vm.attempt = new CourseAttemptsService();
            vm.attempt.section = vm.section._id;
            vm.attempt.edition = vm.edition._id;
            vm.attempt.member = vm.member._id;
            vm.attempt.status = 'initial';
            vm.attempt.$save();
        })
    }
    
    vm.nextSection = nextSection;
    vm.prevSection = prevSection;
    
    function nextSection() {
        if (vm.attempt) {
            vm.attempt.status = 'completed';
            vm.attempt.end = new Date();
            vm.attempt.$update();
            $scope.$parent.nextSection();
        }
    }
    
    function prevSection() {
        if (vm.attempt) {
            vm.attempt.status = 'completed';
            vm.attempt.end = new Date();
            vm.attempt.$update();
            $scope.$parent.prevSection();
        }
    }
   
}
}());