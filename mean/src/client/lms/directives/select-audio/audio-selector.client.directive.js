(function(UIkit) {
  'use strict';

  angular.module('lms')
    .directive('audioSelector', ['$sce', 'Notification', 'Upload', 'deviceDetector', function($sce, Notification, Upload, deviceDetector) {
      return {
        restrict: 'E',
        templateUrl: '/src/client/lms/directives/select-audio/audio-selector.client.view.html',
        controllerAs: 'ctrl',
        scope: {
          object: '='
        },
        link: function(scope, element, attr) {
          var oldURL = scope.object.audioURL;
          scope.resetAudio = function() {
            scope.object.audioURL = oldURL;
          };
          scope.deleteAudio = function() {
            scope.object.audioURL = null;
          };
          var progressbar = angular.element(document.getElementById('audio_upload-progressbar')),
            bar = angular.element(document.getElementById('audio_progress_bar')),
            settings = {
              action: '/api/courses/audio/upload/', // upload url
              param: 'newCourseAudio',
              method: 'POST',

              allow: '*.(mp3|mp4|webm|wav|wma|aac)', // allow only audio

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
                scope.object.audioURL = data.audioURL;
                scope.showProgress = false;
                scope.$apply();
              }
            };

          var select = UIkit.uploadSelect($('#audio_upload-select'), settings),
            drop = UIkit.uploadDrop($('#audio_upload-drop'), settings);

          scope.showProgress = false;

        }
      };
    }]);
}(window.UIkit));
