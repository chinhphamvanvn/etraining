(function() {
  'use strict';

  // Open-text question

  angular.module('lms')
    .directive('feedbackForm', ['fileManagerConfig', '_', feedbackForm]);

  function feedbackForm(fileManagerConfig, _) {
    return {
      scope: {
        feedback: '=',
        mode: '=' // edit, view
      },
      templateUrl: '/src/client/lms/directives/feedback-form/feedback-form.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
      }
    };
  }
}());
