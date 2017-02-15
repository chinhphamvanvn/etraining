(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudyHtmlController', CoursesStudyHtmlController);

CoursesStudyHtmlController.$inject = ['$scope', '$state', '$window', 'HtmlsService','ExamsService','VideosService','EditionSectionsService','Authentication','CourseAttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','memberResolve','treeUtils', '$translate', '$q','_'];

function CoursesStudyHtmlController($scope, $state, $window, HtmlsService,ExamsService,VideosService,EditionSectionsService, Authentication, CourseAttemptsService,edition, CoursesService, Notification, section,member,treeUtils,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    if (vm.section.html) {
        vm.html = HtmlsService.get({htmlId:vm.section.html},function() {
            var attempt = new CourseAttemptsService();
            attempt.section = vm.section._id;
            attempt.edition = vm.edition._id;
            attempt.member = vm.member._id;
            attempt.status = 'completed';
            attempt.$save();
        })
    }
   
}
}());