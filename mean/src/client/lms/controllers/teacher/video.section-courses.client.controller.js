(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesVideoSectionController', CoursesVideoSectionController);

  CoursesVideoSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'editionResolve', 'videoResolve', 'Notification', 'EditionSectionsService', 'fileManagerConfig', '$translate', '$q', '_'];

  function CoursesVideoSectionController($scope, $state, $window, Authentication, $timeout, course, section, edition, video, Notification, EditionSectionsService, fileManagerConfig, $translate, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.edition = edition;
    vm.section = section;
    vm.video = video;
    vm.update = update;
    vm.tinymce_options = fileManagerConfig;

    function saveSection() {
      return $q(function(resolve, reject) {
        //vm.section.html = null;
        vm.section.video = vm.video._id;
        vm.section.$update(function() {
          resolve();
        }, function(errorResponse) {
          Notification.error({
            message: errorResponse.data.message,
            title: '<i class="uk-icon-ban"></i> Section HTML updated error!'
          });
          reject();
        });
      });
    }

    function saveVideo() {
      return $q(function(resolve, reject) {
        vm.video.$update(function() {
          resolve();
        }, function(errorResponse) {
          Notification.error({
            message: errorResponse.data.message,
            title: '<i class="uk-icon-ban"></i> Section HTML updated error!'
          });
          reject();
        });
      });
    }

    function update() {
      saveVideo()
        .then(saveSection)
        .then(function() {
          $state.go('workspace.lms.courses.section.view.video', {
            courseId: vm.course._id,
            sectionId: vm.section._id
          });
        });
    }


  }
}());
