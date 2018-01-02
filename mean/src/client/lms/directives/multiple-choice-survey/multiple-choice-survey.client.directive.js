(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('multipleChoiceSurvey', ['OptionsService', 'QuestionsService', 'fileManagerConfig', '_', multipleChoiceSurvey]);

  function multipleChoiceSurvey(OptionsService, QuestionsService, fileManagerConfig, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        mode: '=' // edit.view/study, result
      },
      templateUrl: '/src/client/lms/directives/multiple-choice-survey/multiple-choice-survey.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
        scope.$watch('question', function() {
          if (scope.question && scope.question._id) {
            scope.question.options = OptionsService.byQuestion({
              questionId: scope.question._id
            }, function() {
              scope.question.options = _.sortBy(scope.question.options, 'order');
              if (scope.mode === 'survey' || scope.mode !== 'result')
                if (scope.answer) {
                  _.each(scope.question.options, function(option) {
                    option.selected = _.contains(scope.answer.options, option._id);
                  });
                }
            });
          } else {
            scope.question.options = [];
          }
        });
        scope.addOption = function() {
          var option = new OptionsService();
          if (scope.question.options.length === 0)
            option.order = scope.question.options.length + 1;
          else
            option.order = _.max(scope.question.options, function(object) { return object.order; }).order + 1;
          option.question = scope.question._id;
          option.$save(function() {
            scope.question.options.push(option);
          });
        };

        scope.translateContent = function() {
          return scope.question.description;
        };

        scope.selectOption = function(option) {
          if (scope.mode !== 'view') {
            _.each(scope.question.options, function(obj) {
              obj.selected = false;
            });
            option.selected = true;
            scope.question.correctOptions = [option._id];
          }
        };

        scope.removeOption = function(option) {
          if (option._id) {
            OptionsService.delete({
              optionId: option._id
            }, function() {
              scope.question.options = _.reject(scope.question.options, function(o) {
                return o._id === option._id;
              });
            });
          }
        };
      }
    };
  }
}());
