(function() {
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

    var videoSelector = document.querySelector('#selectorVideo');

    if (vm.section.video) {
      vm.video = VideosService.get({
        videoId: vm.section.video
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

    // Auto move next section
    var mytimeout;
    videoSelector.addEventListener('ended', handleVideoEnd, false);

    function handleVideoEnd() {
      vm.autoSectionAuto = true;
      vm.counter = 10;
      vm.onTimeout = function() {
        vm.counter--;
        if (vm.counter > 0) {
          mytimeout = $timeout(vm.onTimeout, 1000);
        } else {
          $scope.$parent.nextSection();
        }
      };
      mytimeout = $timeout(vm.onTimeout, 1000);
    }

    vm.stopNextSectionAuto = function() {
      vm.autoSectionAuto = false;
      $timeout.cancel(mytimeout);
    };
  }
}());
