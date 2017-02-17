(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesPreviewHtmlController', CoursesPreviewHtmlController);

CoursesPreviewHtmlController.$inject = ['$scope', '$state', '$window', 'HtmlsService','ExamsService','VideosService','EditionSectionsService','Authentication','CourseAttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','treeUtils', '$translate', '$q','_'];

function CoursesPreviewHtmlController($scope, $state, $window, HtmlsService,ExamsService,VideosService,EditionSectionsService, Authentication, CourseAttemptsService,edition, CoursesService, Notification, section,treeUtils,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;
    
   
}
}());