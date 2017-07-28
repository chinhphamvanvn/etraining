(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesPreviewScormController', CoursesPreviewScormController);

  CoursesPreviewScormController.$inject = ['$scope', '$state', '$window', 'ScormsService', 'ExamsService', 'VideosService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'treeUtils', '$translate', '$q', '_'];

  function CoursesPreviewScormController($scope, $state, $window, ScormsService, ExamsService, VideosService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, treeUtils, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;
    if (vm.section.scorm) {
      vm.scorm = ScormsService.get({
        scormId: vm.section.scorm
      }, function() {});
    }

  }
}());
