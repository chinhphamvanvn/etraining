(function(UIkit) {
  'use strict';

  angular.module('lms')
    .directive('videoAutoplay', function() {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(
            function() {
              return element.attr('data-attr-autoplay');
            },
            function(newVal) {
              if (scope.$eval(newVal)) {
                element[0].autoplay = true;
              } else {
                element[0].autoplay = false;
              }
            }
          );
        }
      };
    })
    .directive('videoControl', function() {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(
            function() {
              return element.attr('data-attr-control');
            },
            function(newVal) {
              if (scope.$eval(newVal)) {
                element[0].controls = true;
              } else {
                element[0].controls = false;
              }
            }
          );
        }
      };
    })
    .directive('videoMuted', function() {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(
            function() {
              return element.attr('data-attr-muted');
            },
            function(newVal) {
              if (scope.$eval(newVal)) {
                element[0].muted = true;
              } else {
                element[0].muted = false;
              }
            }
          );
        }
      };
    })
    .directive('videoSelector', ['$sce', 'Notification', 'Upload', 'deviceDetector', function($sce, Notification, Upload, deviceDetector) {
      return {
        restrict: 'E',
        templateUrl: '/src/client/lms/directives/select-video/video-selector.client.view.html',
        controllerAs: 'ctrl',
        scope: {
          object: '='
        },
        link: function(scope, element, attr) {
          var oldURL = scope.object.videoURL;
          scope.resetVideo = function() {
            scope.object.videoURL = oldURL;
          };
          scope.deleteVideo = function() {
            scope.object.videoURL = null;
          };
          var progressbar = angular.element(document.getElementById('video_upload-progressbar')),
            bar = angular.element(document.getElementById('video_progress_bar')),
            settings = {
              action: '/api/courses/video/upload/', // upload url
              param: 'newCourseVideo',
              method: 'POST',

              allow: '*.(mp3|mp4|webm|mov|avi|flv|mpeg)', // allow only images

              loadstart: function() {
                bar.css('width', '0%').text('0%');
                progressbar.removeClass('uk-hidden');
                scope.videoAttr = {
                  autoplay: false,
                  controls: false,
                  muted: true
                };
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
                scope.object.videoURL = data.videoURL;
                scope.videoAttr = {
                  autoplay: true,
                  controls: true,
                  muted: false
                };
                scope.showProgress = false;
                scope.$apply();
              }
            };

          var select = UIkit.uploadSelect($('#video_upload-select'), settings),
            drop = UIkit.uploadDrop($('#video_upload-drop'), settings);

          scope.showProgress = false;

        }
      };
    }]);
}(window.UIkit));
