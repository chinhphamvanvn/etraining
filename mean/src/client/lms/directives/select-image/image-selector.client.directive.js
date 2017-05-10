(function(UIkit) {
  'use strict';

  angular.module('lms')
    .directive('imageSelector', ['$sce', 'Notification', 'Upload', 'deviceDetector', function($sce, Notification, Upload, deviceDetector) {
      return {
        restrict: 'E',
        templateUrl: '/src/client/lms/directives/select-image/image-selector.client.view.html',
        controllerAs: 'ctrl',
        scope: {
          object: '='
        },
        link: function(scope, element, attr) {
          var oldURL = scope.object.imageURL;
          scope.resetImage = function() {
            scope.object.imageURL = oldURL;
          }
          scope.deleteImage = function() {
            scope.object.imageURL = null;
          }
          var progressbar = angular.element(document.getElementById('image_upload-progressbar')),
            bar = angular.element(document.getElementById('image_progress_bar')),
            settings = {
              action: '/api/courses/image/upload/', // upload url
              param: 'newCourseImage',
              method: 'POST',

              allow: '*.(jpg|gif|jpeg|png|bmp)', // allow only images

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
                scope.object.imageURL = data.imageURL;
                scope.showProgress = false;
                scope.$apply();
              }
            };

          var select = UIkit.uploadSelect($('#image_upload-select'), settings),
            drop = UIkit.uploadDrop($('#image_upload-drop'), settings);

          scope.showProgress = false;

        }
      };
    }]);
}(window.UIkit));
