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
        templateUrl: '/src/client/lms/directives/video-selector/video-selector.client.directive.view.html',
        controllerAs: 'ctrl',
        scope: {
          video: '='
        },
        link: function(scope, element, attr) {
          var progressbar = angular.element(document.getElementById('file_upload-progressbar')),
            bar = angular.element(document.getElementById('progress_bar')),
            settings = {
              action: '/api/videos/upload', // upload url
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
                scope.video.videoURL = data.videoURL;
                console.log(scope.video);
                scope.videoAttr = {
                  autoplay: true,
                  controls: true,
                  muted: false
                };
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
