(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStudyPracticeController', CoursesStudyPracticeController);

  CoursesStudyPracticeController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'PracticesService', 'AnswersService', 'OptionsService', 'FeedbacksService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'memberResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesStudyPracticeController($scope, $state, $window, QuestionsService, PracticesService, AnswersService, OptionsService, FeedbacksService, Authentication, AttemptsService, edition, CoursesService, Notification, section, member, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    if (vm.section.practice) {
      vm.practice = PracticesService.get({
        practiceId: vm.section.practice
      }, function() {
        vm.attempt = new AttemptsService();
        vm.attempt.section = vm.section._id;
        vm.attempt.edition = vm.edition._id;
        vm.attempt.course = vm.edition.course;
        vm.attempt.member = vm.member._id;
        vm.attempt.status = 'initial';
        vm.attempt.$save();
      });
    }

    $scope.$on('$stateChangeStart', function() {
      if (vm.attempt) {
        vm.attempt.status = 'completed';
        vm.attempt.end = new Date();
        if (vm.attempt._id)
          vm.attempt.$update();
        else
          vm.attempt.$save();
      }
    });
  }
}());
