(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('questionInfo', [questionInfo]);

  function questionInfo(OptionsService, QuestionsService, fileManagerConfig, $translate, _) {
    return {
      scope: {
        question: '=',
        show: '='
      },
      templateUrl: '/src/client/lms/directives/question-info/question.info.directive.client.view.html',
      link: function(scope, element, attributes) {}
    };
  }
}());
