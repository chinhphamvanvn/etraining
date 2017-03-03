(function () {
  'use strict';

// Courses controller
  angular
    .module('lms')
    .controller('CoursesStudyVideoController', CoursesStudyVideoController);

  CoursesStudyVideoController.$inject = ['$scope', '$state', '$window', '$timeout', 'HtmlsService', 'ExamsService', 'VideosService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'memberResolve', 'treeUtils', '$translate', '$q', '_'];

  function CoursesStudyVideoController($scope, $state, $window, $timeout, HtmlsService, ExamsService, VideosService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, member, treeUtils, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    vm.autoSectionAuto = false;
    vm.endCourse = $scope.endCourse;

    var videoSelector = document.querySelector('#selectorVideo');

    if (vm.section.video) {
      vm.video = VideosService.get({videoId: vm.section.video}, function () {
        vm.attempt = new AttemptsService();
        vm.attempt.section = vm.section._id;
        vm.attempt.edition = vm.edition._id;
        vm.attempt.course = vm.edition.course;
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

    // Auto move next section
    var mytimeout;
    videoSelector.addEventListener('ended', handleVideoEnd, false);

    function handleVideoEnd() {
      vm.autoSectionAuto = true;
      vm.counter = 10;
      vm.onTimeout = function () {
        vm.counter--;
        if (vm.counter > 0) {
          mytimeout = $timeout(vm.onTimeout, 1000);
        } else {
          nextSection();
        }
      };
      mytimeout = $timeout(vm.onTimeout, 1000);
    }

    vm.stopNextSectionAuto = function() {
      vm.autoSectionAuto = false;
      $timeout.cancel(mytimeout);
    }
  }
}());
