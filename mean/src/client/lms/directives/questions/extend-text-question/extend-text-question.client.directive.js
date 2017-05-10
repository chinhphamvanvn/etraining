(function() {
  'use strict';

  // Open-text question

  angular.module('lms')
    .directive('extendTextQuestion', ['fileManagerConfig', '_', extendTextQuestion]);

  function extendTextQuestion(fileManagerConfig, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        mode: '=' // edit, view, study, result
      },
      templateUrl: '/src/client/lms/directives/questions/extend-text-question/extend-text-question.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
        scope.videoAttr = {
          autoplay: false,
          controls: true,
          muted: false
        };
        function preprocessQuestionContent() {
        }
        preprocessQuestionContent();
      }
    };
  }
}());
