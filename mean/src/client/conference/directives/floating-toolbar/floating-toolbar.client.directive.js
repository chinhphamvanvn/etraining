(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('conference')
    .directive('floatingToolbar', ['ngAudio', '$timeout', 'conferenceSocket', '$location', '_', floatingToolbar]);

  function floatingToolbar(ngAudio, $timeout, conferenceSocket, $location, _) {
    return {
      scope: {
        connected: '=',
        connecting: '=',
        localStream: '=',
        member: '=',
        onConnecting: '&',
        onConnected: '&',
        onDisconnected: '&'
      },
      templateUrl: '/src/client/conference/directives/floating-toolbar/floating-toolbar.client.view.html',
      link: function(scope, element, attributes) {
        scope.video = true;
        scope.audio = true;
        scope.handUp = false;
        scope.sound = ngAudio.load("/assets/sounds/ring.mp3");
        scope.showToolbar = true;
        scope.hideToolbar = function() {
          $timeout(function() {
            scope.showToolbar = false;
          }, 5000);
        };
        scope.connect = function() {
          scope.sound.play();
          scope.sound.loop = true;
          if (scope.onConnecting)
            scope.onConnecting();
          conferenceSocket.join();
          scope.sound.stop();
          if (scope.onConnected)
            scope.onConnected();
        }

        scope.disconnect = function() {
          scope.sound.stop();
          conferenceSocket.leave();
          if (scope.onDisconnected)
            scope.onDisconnected();
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
            videoTrack.enabled = scope.video;
          }
        }
        scope.toggleHand = function() {
          scope.handUp = !scope.handUp;
          if (scope.handUp)
            conferenceSocket.handUp();
          else
            conferenceSocket.handDown();
        }

        scope.signout = function() {
          conferenceSocket.leave();
          if (scope.onDisconnected)
            scope.onDisconnected();
          $location.path('/');
        }
        scope.toggleHand = function() {
          scope.handUp = !scope.handUp;
          if (scope.handUp) {
            conferenceSocket.handUp();
          } else {
            conferenceSocket.handDown();
          }
        }
      }
    }
  }
}());
