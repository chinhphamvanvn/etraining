(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('conference')
    .directive('floatingToolbar', ['ngAudio', '_', floatingToolbar]);

  function floatingToolbar(ngAudio, _) {
    return {
      scope: {
        visible: '=',
        localStream: '=',
        connectCall: '&',
        disconnectCall: '&',
        raiseHand: '&',
        leaveConference: '&'
      },
      templateUrl: '/src/client/conference/directives/floating-toolbar/floating.toolbar.client.view.html',
      link: function(scope, element, attributes) {
        scope.onCall = false;
        scope.handUp = false;
        scope.sound = ngAudio.load("/assets/sounds/ring.mp3");
        scope.connect = function() {
          scope.sound.play();
          scope.sound.loop = true;
          scope.connecting = true;
          if (scope.connectCall)
            scope.connectCall();
        }

        scope.disconnect = function() {
          scope.onCall = false;
          scope.sound.stop();
          if (scope.disconnectCall)
            scope.disconnectCall();
        }
        scope.toggleAudio = function() {
          if (scope.localStream) {
            var audioTrack = scope.localStream.getAudioTracks()[0];
            scope.audio = !scope.audio;
            audioTrack.enabled = scope.audio;
          }

        }
        scope.toggleVideo = function() {
          if (scope.localStream) {
            var videoTrack = scope.localStream.getVideoTracks()[0];
            scope.video = !scope.video;
            videoTrack.enabled = $scope.video;
          }
        }
        scope.toggleHand = function() {
          scope.handUp = !scope.handUp;
          if (scope.raiseHand)
            scope.raiseHand(scope.handUp);
        }
        
        scope.signout = function() {
          if (scope.leaveConference)
            scope.leaveConference();
        }
      }
    };
  }
}());
