(function() {
  'use strict';

  angular.module('lms')
    .directive('trainingPronounciation', ['$filter', 'statistics', trainingPronounciation]);

  function trainingPronounciation($filter, statistics) {
    return {
      scope: {
        practice: '=',
      },
      templateUrl: '/src/client/lms/directives/trainings/pronounciation/training-pronounciation.directive.client.view.html',
      link: function(scope, element, attributes) {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition ;
        scope.listenMode = false;
        scope.speakMode = false;
        scope.recognizing = false;
        scope.recognition = null;        
        scope.transcript = '';
        scope.accuracy = 0;
        
        scope.listen = function() {
          if (scope.listenMode)
            return;
          if (scope.speakMode) {
            if (scope.recognition)
              scope.recognition.stop();
          }
          var msg = new window.SpeechSynthesisUtterance();
          msg.voiceURI = 'native';
          msg.volume = 1; // 0 to 1
          msg.rate = 1; // 0.1 to 10
          msg.pitch = 1; //0 to 2
          msg.text = plainText;
          msg.lang = 'en-US';
          window.speechSynthesis.speak(msg);
          scope.listenMode = true;
          scope.speakMode = false;
        };
        scope.speak = function() {
          if (scope.speakMode)
            return;
          if (scope.listenMode) {
            window.speechSynthesis.cancel();
          }
          scope.listenMode = false;
          scope.speakMode = true;
          scope.recognizing = true;
          window.speechSynthesis.cancel();
          scope.recognition = new window.SpeechRecognition();
          scope.recognition.continuous = true;
          scope.recognition.interimResults = true;
          scope.recognition.onstart = function() {
            
          };
          scope.recognition.onerror = function(event) {
            console.log('Recognize error', event);
            scope.recognizing = false;
          }
          scope.recognition.onresult = function(event) {
            var interim_transcript = '';
            if (typeof(event.results) == 'undefined') {
              scope.recognizing = false;
              scope.recognition.stop();
              return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                scope.transcript += event.results[i][0].transcript;
              } else {
                interim_transcript += event.results[i][0].transcript;
              }
            }
            scope.accuracy = statistics.correlation(scope.transcript, scope.practice.text) ;
            scope.transcript = capitalize(scope.transcript);
            scope.$apply();
          };
          scope.recognition.start();
        };
        scope.reset = function() {
          scope.transcript = '';
          scope.listenMode = false;
          scope.speakMode = false;
          scope.accuracy = 0;
          window.speechSynthesis.cancel();
          if (scope.recognition)
            scope.recognition.stop();
        }
        
        var two_line = /\n\n/g;
        var one_line = /\n/g;
        function linebreak(s) {
          return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        }

        var first_char = /\S/;
        function capitalize(s) {
          return s.replace(first_char, function(m) { return m.toUpperCase(); });
        }

      }
    };
  }
}());
