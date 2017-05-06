(function(MRecordRTC) {
  'use strict';

  angular.module('lms')
    .directive('recorderVideo', ['$sce', 'Notification', 'Upload', 'deviceDetector', 'screenShare', function($sce, Notification, Upload, deviceDetector, screenShare) {
      return {
        restrict: 'E',
        templateUrl: '/src/client/lms/directives/recorder-video/recorder-video.client.directive.view.html',
        controllerAs: 'ctrl',
        scope: {
          object: '='
        },
        link: function(scope, element, attr) {
          var oldUrl = scope.object ? scope.object.videoUrl : null;
          scope.resetVideo = function() {
            scope.object.videoUrl = oldUrl;
          }
          scope.deleteVideo = function() {
            scope.object.videoUrl = null;
          }
          scope.videoAttr = {
              autoplay: false,
              controls: true,
              muted: false
            };
          var mediaStream;
          var videoRecorder = new MRecordRTC();
          videoRecorder.mediaType = {
            audio: true, // or StereoAudioRecorder
            video: true // or WhammyRecorder
          };
          // mimeType is optional and should be set only in advance cases.
          videoRecorder.mimeType = {
            audio: 'audio/wav',
            video: 'video/webm'
          };

          scope.startRecord = function() {
            if (!scope.recordMode) {
              scope.videoAttr = {
                  autoplay: true,
                  controls: false,
                  muted: true
                };
              scope.recordMode = true;
              var session = {
                  audio: true,
                  video: true
                };
                navigator.getUserMedia(session, function(stream) {
                  mediaStream = stream;
                  videoRecorder.addStream(mediaStream);
                  videoRecorder.startRecording();
                }, function(error) {
                  scope.screen = false;
                  Notification.error({
                    message: '<i class="uk-icon-ban"></i> Voice captured error!' + error
                  });
                });
              
            }
          };

          scope.stopRecord = function() {
            scope.videoAttr = {
                autoplay: true,
                controls: true,
                muted: false
              };
            videoRecorder.stopRecording(function(videoUrl) {
              mediaStream.getAudioTracks().forEach(function(track) {
                track.stop();
              });
              mediaStream.getVideoTracks().forEach(function(track) {
                track.stop();
              });
              scope.recordMode = false;
              scope.videoUrl = videoUrl;
              var blobs = videoRecorder.getBlob();
              var videoBlob = blobs.video;
              var videoFile = new File([videoBlob], new Date().getTime() + 'upload.webm', {
                type: 'video/webm'
              });
              onDataAvail(videoFile);
            });
          };

          function onDataAvail(videoFile) {
            console.log(videoFile);
            Upload.upload({
              url: '/api/users/video/upload',
              data: {
                newVideo: videoFile
              }
            }).then(function(response) {
              scope.object.videoUrl = response.data.videoUrl;
              console.log(scope.object);
            }, function(errorResponse) {
              Notification.error({
                message: errorResponse.data.message,
                title: '<i class="uk-icon-ban"></i> Video uploaded error!'
              });
            });

          }

        }
      };
    }]);
}(window.MRecordRTC));
