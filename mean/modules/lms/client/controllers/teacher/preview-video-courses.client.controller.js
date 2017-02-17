(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesPreviewVideoController', CoursesPreviewVideoController);

CoursesPreviewVideoController.$inject = ['$scope', '$state', '$window', 'HtmlsService','ExamsService','VideosService','EditionSectionsService','Authentication','CourseAttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','treeUtils', '$translate', '$q','_'];

function CoursesPreviewVideoController($scope, $state, $window, HtmlsService,ExamsService,VideosService,EditionSectionsService, Authentication, CourseAttemptsService,edition, CoursesService, Notification, section,treeUtils,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;
    if (vm.section.video) 
        vm.video = VideosService.get({videoId:vm.section.video});
   
}
}());