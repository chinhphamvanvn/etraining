(function() {
  'use strict';

  /*
   * Source: https://webrtcexperiment-webrtc.netdna-ssl.com/getScreenId.js
   */
  angular.module('lms').factory('screenShare', ['$log', 'deviceDetector', function($log, deviceDetector) {
    var iframe;
    function getScreenConstraints(error, sourceId) {
      var screen_constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: error ? 'screen' : 'desktop',
            maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
            maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
          },
          optional: []
        }
      };

      if (deviceDetector.browser === 'firefox') {
        screen_constraints = {
          video: {
            mediaSource: 'window'
          },
          audio: true
        };
      }

      if (sourceId) {
        screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
      }

      return screen_constraints;
    }

    function postMessage() {
      if (!iframe) {
        loadIFrame(postMessage);
        return;
      }

      if (!iframe.isLoaded) {
        setTimeout(postMessage, 100);
        return;
      }

      iframe.contentWindow.postMessage({
        captureSourceId: true
      }, '*');
    }

    function loadIFrame(loadCallback) {
      if (iframe) {
        loadCallback();
        return;
      }

      iframe = document.createElement('iframe');
      iframe.onload = function() {
        iframe.isLoaded = true;
        loadCallback();
      };
      iframe.src = 'https://www.webrtc-experiment.com/getSourceId/'; // https://wwww.yourdomain.com/getScreenId.html
      iframe.style.display = 'none';
      (document.body || document.documentElement).appendChild(iframe);
    }

    return {
      start: function(callback) {
        var option;
        navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        if (!!navigator.mozGetUserMedia) {
          option = {
            video: {
              mozMediaSource: 'window',
              mediaSource: 'window'
            }
          };
          navigator.getUserMedia(option, function(stream) {
            callback(true, stream, 'firefox');
          }, function(error) {
            $log.error('Share screen in firfox failed', error);
            callback(false);
          });
          return;
        }
        postMessage();
        window.addEventListener('message', onIFrameCallback);

        function onIFrameCallback(event) {
          if (!event.data) return;

          if (event.data.chromeMediaSourceId) {
            if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
              $log.error('permission-denied');
              callback(false);
            } else {
              var sourceId = event.data.chromeMediaSourceId;
              option = getScreenConstraints(null, sourceId);
              navigator.getUserMedia(option, function(stream) {
                callback(true, stream, sourceId);
              }, function(error) {
                $log.error('Share screen in Chome failed', error);
                callback(false);
              });
            }
          }

          if (event.data.chromeExtensionStatus) {
            var extStatus = event.data.chromeExtensionStatus;
            option = getScreenConstraints(extStatus);
            navigator.getUserMedia(option, function(stream) {
              callback(true, stream, null);
            }, function(error) {
              $log.error('Share screen in Chome failed', error);
              callback(false);
            });
          }

          // this event listener is no more needed
          window.removeEventListener('message', onIFrameCallback);
        }
      }
    };
  }]);

}());
