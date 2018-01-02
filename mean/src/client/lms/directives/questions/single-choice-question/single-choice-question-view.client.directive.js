(function() {
  'use strict';

  // Single-choice Question

  angular.module('lms')
    .directive('singleChoiceQuestion', ['OptionsService', 'QuestionsService', 'fileManagerConfig', '_', singleChoiceQuestion]);

  function singleChoiceQuestion(OptionsService, QuestionsService, fileManagerConfig, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        shuffle: '=',
        showExplain: '=',
        mode: '=' // edit.view/study, result
      },
      templateUrl: '/src/client/lms/directives/questions/single-choice-question/single-choice-question.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
        scope.$watch('question', function() {
          if (scope.question._id)
            scope.question.options = OptionsService.byQuestion({
              questionId: scope.question._id
            }, function() {
              enterMode();
            });
          else {
            scope.question.options = [];
            enterMode();
          }
        });

        function enterMode() {
          switch (scope.mode) {
            case 'edit':
              markCorrectOption();
              scope.addOption = addOption;
              scope.removeOption = removeOption;
              scope.selectOption = function(option) {
                selectSingleOption(option);
                updateCorrectOption(option);
              };
              break;
            case 'study':
              preprocessQuestionContent();
              rearrangeOptions();
              markAnswerOption();
              scope.selectOption = selectSingleOption;
              break;
            case 'view':
              preprocessQuestionContent();
              markCorrectOption();
              break;
            case 'result':
              preprocessQuestionContent();
              markAnswerOption();
              break;
          }
        }

        function rearrangeOptions() {
          if (scope.shuffle) {
            var options = scope.question.options;
            if (!scope.question.shuffleIndex)
              scope.question.shuffleIndex = Math.floor(Math.random() * options.length);
            scope.question.options = [];
            for (var i = 0; i < options.length; i++)
              scope.question.options.push(options[(scope.question.shuffleIndex + i) % options.length]);
          } else
            scope.question.options = _.sortBy(scope.question.options, 'order');
        }

        function markCorrectOption() {
          _.each(scope.question.options, function(option) {
            option.selected = _.contains(scope.question.correctOptions, option._id);
          });
        }

        function markAnswerOption() {
          if (scope.answer) {
            _.each(scope.question.options, function(option) {
              option.selected = _.contains(scope.answer.options, option._id);
            });
          }
        }

        function addOption() {
          var option = new OptionsService();
          if (scope.question.options.length === 0)
            option.order = scope.question.options.length + 1;
          else
            option.order = _.max(scope.question.options, function(object) { return object.order;}).order + 1;
          option.question = scope.question._id;
          option.$save(function() {
            scope.question.options.push(option);
          });
        }

        function selectSingleOption(option) {
          _.each(scope.question.options, function(obj) {
            if (obj._id !== option._id)
              obj.selected = false;
          });
        }

        function updateCorrectOption(option) {
          var correctOptions = _.filter(scope.question.options, function(option) {
            return option.selected;
          });
          scope.question.correctOptions = _.pluck(correctOptions, '_id');
        }

        function preprocessQuestionContent() {
        }

        function removeOption(option) {
          scope.question.options = _.reject(scope.question.options, function(o) {
            return o._id === option._id;
          });
          scope.question.correctOptions = _.reject(scope.question.correctOptions, function(o) {
            return o === option._id;
          });
          OptionsService.delete({
            optionId: option._id
          });
        }
      }
    };
  }
}());
