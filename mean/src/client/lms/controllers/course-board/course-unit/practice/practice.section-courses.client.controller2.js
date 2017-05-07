(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesPracticeSectionController', CoursesPracticeSectionController);

  CoursesPracticeSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'editionResolve', 'practiceResolve', 'Notification', 'fileManagerConfig', 'PracticesService', 'EditionSectionsService', '$q', '_'];

  function CoursesPracticeSectionController($scope, $state, $window, Authentication, $timeout, course, section, edition, practice, Notification, fileManagerConfig, PracticesService, EditionSectionsService, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.tinymce_options = fileManagerConfig;
    vm.course = course;
    vm.edition = edition;
    vm.section = section;
    vm.practice = practice;
    vm.save = save;

    function saveSection() {
      return $q(function(resolve, reject) {
        var name = vm.section.name.trim();
        if (!name) {
          UIkit.modal.alert($translate.instant('ERROR.GROUP.EMPTY_NAME_NOT_ALLOW'));
          return;
        } else {
          vm.section.practice = vm.practice._id;
          vm.section.$update(function() {
            resolve();
          }, function(errorResponse) {
            Notification.error({
              message: errorResponse.data.message,
              title: '<i class="uk-icon-ban"></i> Section HTML updated error!'
            });
            reject();
          });
        }
      });
    }

    function savePractice() {
      return $q(function(resolve, reject) {
        vm.practice.name = vm.section.name;
        vm.practice.$update(function() {
          resolve();
        }, function(errorResponse) {
          Notification.error({
            message: errorResponse.data.message,
            title: '<i class="uk-icon-ban"></i> Section Practice updated error!'
          });
          reject();
        });
      });
    }

    function save() {
      savePractice()
        .then(saveSection)
        .then(function() {
          $state.go('workspace.lms.courses.section.view.practice', {
            courseId: vm.course._id,
            sectionId: vm.section._id
          });
        });
    }

  }
}());
