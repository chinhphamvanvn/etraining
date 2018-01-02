(function(UIkit, $) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesHTMLSectionController', CoursesHTMLSectionController);

  CoursesHTMLSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'editionResolve', 'htmlResolve', 'Notification', 'EditionSectionsService', 'fileManagerConfig', '$q', '_', '$translate', '$sce'];

  function CoursesHTMLSectionController($scope, $state, $window, Authentication, $timeout, course, section, edition, html, Notification, EditionSectionsService, fileManagerConfig, $q, _, $translate, $sce) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.edition = edition;
    vm.section = section;
    vm.html = html;
    vm.html.content= $sce.trustAsHtml(vm.html.content);

    vm.save = save;
    vm.tinymce_options = fileManagerConfig;

    function saveSection() {
      return $q(function(resolve, reject) {
        var name = vm.section.name.trim();
        if (!name) {
          UIkit.modal.alert($translate.instant('ERROR.GROUP.EMPTY_NAME_NOT_ALLOW'));
          return;
        } else {
          vm.section.html = vm.html._id;
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

    function saveHtml() {
      return $q(function(resolve, reject) {
        vm.html.$update(function() {
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

    function save() {
      saveHtml()
        .then(saveSection)
        .then(function() {
          $state.go('workspace.lms.courses.section.view.html', {
            courseId: vm.course._id,
            sectionId: vm.section._id
          });
        });
    }
    
    var progressbar = $('#file_upload-progressbar'),
    bar = progressbar.find('.uk-progress-bar'),
    settings = {
      action: '/api/courses/content/convert', // upload url
      param: 'contentFile',
      method: 'POST',


      loadstart: function() {
        bar.css('width', '0%').text('0%');
        progressbar.removeClass('uk-hidden');
      },

      progress: function(percent) {
        percent = Math.ceil(percent);
        bar.css('width', percent + '%').text(percent + '%');
      },

      allcomplete: function(response) {

        bar.css('width', '100%').text('100%');

        setTimeout(function() {
          progressbar.addClass('uk-hidden');
        }, 250);
        var data = JSON.parse(response);
        vm.html.content = data.html;
        console.log(data);
        $scope.$apply();
        

      }
    };
    
    var select = UIkit.uploadSelect($('#file_upload-select'), settings),
    drop = UIkit.uploadDrop($('#file_upload-drop'), settings);
  }
}(window.UIkit, window.jQuery));
