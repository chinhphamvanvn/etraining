(function(MRecordRTC) {
  'use strict';

  angular.module('lms')
    .directive('recorderAudio', ['$sce', 'Notification', 'Upload', 'deviceDetector', 'screenShare', '$timeout',
     function($sce, Notification, Upload, deviceDetector, screenShare, $timeout) {
      return {
        restrict: 'E',
        templateUrl: '/src/client/lms/directives/recorder-audio/recorder-audio.client.view.html',
        controllerAs: 'ctrl',
        scope: {
          object: '='
        },
        link: function(scope, element, attr) {
          scope.videoAttr = {
            autoplay: false,
            controls: true,
            muted: false
          };
          $(".uk-modal").on({
            'show.uk.modal': function(){
            },
            'hide.uk.modal': function(){
              if(scope.recordMode){
                scope.stopRecord();
              }
              var objectAudio = document.getElementById("objectAudio");
              objectAudio.pause();
            }
          });
          // config view wavesurfer record
          var random_id = Math.floor(Math.random() * 10000) + 1;
          scope.id_video_js = "myAudio_"+random_id;
          var player;
          $timeout(function() {
            player = new videojs(scope.id_video_js, {
              controls: false,
              width: 400,
              height: 100,
              plugins: {
                wavesurfer: {
                  src: "live",
                  waveColor: "black",
                  progressColor: "#2E732D",
                  debug: true,
                  cursorWidth: 1,
                  msDisplayMax: 20,
                  hideScrollbar: true
                },
                record: {
                  audio: true,
                  video: false,
                  maxLength: 10000,
                  debug: false
                }
              }
            });
          }, 1000);
          

          var oldUrl = scope.object ? scope.object.audioUrl : null;
          scope.resetAudio = function() {
            scope.object.audioUrl = oldUrl || null;
          }
          scope.deleteAudio = function() {
            scope.object.audioUrl = null;
          }
          var mediaStream;
          var audioRecorder = new MRecordRTC();
          audioRecorder.mediaType = {
            audio: true, // or StereoAudioRecorder
            video: false // or WhammyRecorder
          };
          // mimeType is optional and should be set only in advance cases.
          audioRecorder.mimeType = {
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
                video: false
              };
              navigator.getUserMedia(session, function(stream) {
                mediaStream = stream;
                audioRecorder.addStream(mediaStream);
                audioRecorder.startRecording();
              }, function(error) {
                Notification.error({
                  message: '<i class="uk-icon-ban"></i> Audio captured error!' + error
                });
              });
              player.recorder.start();
            }
          };

          scope.stopRecord = function() {
            scope.videoAttr = {
                autoplay: true,
                controls: true,
                muted: false
              };
            audioRecorder.stopRecording(function(audioUrl) {
              mediaStream.getAudioTracks().forEach(function(track) {
                track.stop();
              });
              mediaStream.getVideoTracks().forEach(function(track) {
                track.stop();
              });
              scope.recordMode = false;
              scope.audioUrl = audioUrl;
              var blobs = audioRecorder.getBlob();
              var audioBlob = blobs.audio;
              var audioFile = new File([audioBlob], new Date().getTime() + 'upload.webm', {
                type: 'audio/webm'
              });
              onDataAvail(audioFile);
            });
          };


          function onDataAvail(audioFile) {
            console.log(audioFile);
            Upload.upload({
              url: '/api/users/audio/upload',
              data: {
                newAudio: audioFile
              }
            }).then(function(response) {
              scope.object.audioUrl = response.data.audioUrl;
            }, function(errorResponse) {
              Notification.error({
                message: errorResponse.data.message,
                title: '<i class="uk-icon-ban"></i> Audio uploaded error!'
              });
            });

          }

        }
      };
    }]);
}(window.MRecordRTC));
