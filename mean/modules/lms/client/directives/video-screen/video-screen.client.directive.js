(function(MRecordRTC) {
  'use strict';

  angular.module('lms')
    .directive('videoScreen', ['$sce', 'Notification', 'Upload', 'deviceDetector', 'screenShare', function($sce, Notification, Upload, deviceDetector, screenShare) {
      return {
        restrict: 'E',
        templateUrl: '/modules/lms/client/directives/video-screen/video-screen.client.directive.view.html',
        controllerAs: 'ctrl',
        scope: {
          video: '='
        },
        link: function(scope, element, attr) {

          function addStreamStopListener(stream, callback) {
            var streamEndedEvent = 'ended';

            if ('oninactive' in stream) {
              streamEndedEvent = 'inactive';
            }

            stream.addEventListener(streamEndedEvent, function() {
              callback();
              callback = function() {};
            }, false);

            stream.getAudioTracks().forEach(function(track) {
              track.addEventListener(streamEndedEvent, function() {
                callback();
                callback = function() {};
              }, false);
            });

            stream.getVideoTracks().forEach(function(track) {
              track.addEventListener(streamEndedEvent, function() {
                callback();
                callback = function() {};
              }, false);
            });
          }

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
          var screenCamera = document.getElementById('screenVideo');

          scope.selectScreen = function() {
            screenShare.start(function(success, screenStream, source) {
              if (success) {
                scope.screen = true;
                scope.$apply();
                addStreamStopListener(screenStream, function() {
                  scope.screen = false;
                  videoRecorder.stopRecording();
                });
                var session = {
                  audio: true,
                  video: false
                };
                navigator.getUserMedia(session, function(mediaStream) {
                  screenStream.addTrack(mediaStream.getAudioTracks()[0]);
                  videoRecorder.addStream(screenStream);
                }, function(error) {
                  scope.screen = false;
                  Notification.error({
                    message: '<i class="uk-icon-ban"></i> Voice captured error!' + error
                  });
                });
              } else {
                scope.screen = false;
                Notification.error({
                  message: '<i class="uk-icon-ban"></i> Screen captured error!'
                });
              }
            });
          };

          scope.startRecord = function() {
            if (!scope.recordMode) {
              scope.recordMode = true;
              videoRecorder.startRecording();
            }
          };

          scope.stopRecord = function() {
            videoRecorder.stopRecording(function(videoURL) {
              scope.recordMode = false;
              scope.screenURL = videoURL;
              var blobs = videoRecorder.getBlob();
              var videoBlob = blobs.video;
              var videoFile = new File([videoBlob], new Date().getTime() + 'upload.webm', {
                type: 'audio/webm'
              });
              onDataAvail(videoFile);
            });
          };


          function onDataAvail(videoFile) {
            console.log(videoFile);
            Upload.upload({
              url: '/api/videos/upload',
              data: {
                newCourseVideo: videoFile
              }
            }).then(function(response) {
              scope.video.videoURL = response.data.videoURL;
              console.log(scope.video);
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
