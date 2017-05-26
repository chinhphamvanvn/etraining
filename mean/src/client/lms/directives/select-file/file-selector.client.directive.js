(function(UIkit) {
  'use strict';

  angular.module('lms')
    .directive('fileSelector', ['$sce', 'Notification', 'Upload', 'deviceDetector', function($sce, Notification, Upload, deviceDetector) {
      return {
        restrict: 'E',
        templateUrl: '/src/client/lms/directives/select-file/file-selector.client.view.html',
        controllerAs: 'ctrl',
        scope: {
          object: '='
        },
        link: function(scope, element, attr) {
          var oldURL = scope.object.fileURL;
          scope.resetFile = function() {
            scope.object.fileURL = oldURL;
          };
          scope.deleteFile = function() {
            scope.object.fileURL = null;
          };
          var progressbar = angular.element(document.getElementById('file_upload-progressbar')),
            bar = angular.element(document.getElementById('progress_bar')),
            settings = {
              action: '/api/courses/file/upload/', // upload url
              param: 'newCourseFile',
              method: 'POST',

              allow: '*.*', // allow any files

              loadstart: function() {
                bar.css('width', '0%').text('0%');
                progressbar.removeClass('uk-hidden');
                scope.showProgress = true;
                scope.$apply();
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
                scope.object.fileURL = data.fileURL;
                scope.showProgress = false;
                scope.$apply();
              }
            };

          var select = UIkit.uploadSelect($('#file_upload-select'), settings),
            drop = UIkit.uploadDrop($('#file_upload-drop'), settings);

          scope.showProgress = false;

        }
      };
    }]);
}(window.UIkit));
