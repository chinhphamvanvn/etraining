(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesPreviewHtmlController', CoursesPreviewHtmlController);

  CoursesPreviewHtmlController.$inject = ['$scope', '$state', '$window', 'HtmlsService', 'ExamsService', 'VideosService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'treeUtils', '$translate', '$q', '_', '$sce'];

  function CoursesPreviewHtmlController($scope, $state, $window, HtmlsService, ExamsService, VideosService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, treeUtils, $translate, $q, _, $sce) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;
    if (vm.section.html) {
      vm.html = HtmlsService.get({
        htmlId: vm.section.html
      }, function() {
        vm.html.content= $sce.trustAsHtml(vm.html.content);
      });
    }

  }
}());
