(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesPreviewPracticeController', CoursesPreviewPracticeController);

  CoursesPreviewPracticeController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'PracticesService', 'AnswersService', 'OptionsService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesPreviewPracticeController($scope, $state, $window, QuestionsService, PracticesService, AnswersService, OptionsService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;

    if (vm.section.practice) {
      vm.practice = PracticesService.get({
        practiceId: vm.section.practice
      }, function() {});
    }

  }
}());
