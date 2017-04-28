(function(UIkit, $) {
  'use strict';

  // Point-click Question

  angular.module('lms')
    .directive('pointClickQuestion', ['OptionsService', 'QuestionsService', '$timeout', 'fileManagerConfig', '_', pointClickQuestion]);

  function pointClickQuestion(OptionsService, QuestionsService, $timeout, fileManagerConfig, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        shuffle: '=',
        mode: '=' // edit.view/study, result
      },
      templateUrl: '/src/client/lms/directives/questions/point-click-question/point-click-question.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
        scope.$watch('question', function() {
          if (scope.question._id)
            scope.question.options = OptionsService.byQuestion({
              questionId: scope.question._id
            }, function() {
              if (!scope.question.svgData)
                scope.question.svgData = {};
              else
                scope.question.svgData = angular.fromJson(scope.question.svgData);
              _.each(scope.question.options, function(option) {
                if (option._id in scope.question.svgData)
                  option.svgData = scope.question.svgData[option._id];
                else {
                  option.svgData = {
                    x: 0,
                    y: 0
                  };
                  scope.question.svgData[option._id] = option.svgData;
                }
              });
              enterMode();
            });
          else {
            scope.question.options = [];
            scope.question.svgData = {};
            enterMode();
          }
        });

        function enterMode() {
          switch (scope.mode) {
            case 'edit':
              setupSvgInteraction();
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
            option.svgData = {
              x: 100,
              y: 100
            };
            updateSvgData();
          });
        }

        function selectSingleOption(option) {
          _.each(scope.question.options, function(obj) {
            if (obj._id !== option._id)
              obj.selected = false;
          });
          option.selected = true;
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
          _.each(scope.question.options, function(option, index) {
            option.order = index + 1;
          });
          updateSvgData();
          OptionsService.delete({
            optionId: option._id
          });
        }

        function updateSvgData() {
          scope.question.svgData = {};
          _.each(scope.question.options, function(option) {
            scope.question.svgData[option._id] = option.svgData;
          });
        }

        function setupSvgInteraction() {
          $timeout(function() {
            var settings = {
              action: '/api/questions/image/upload', // upload url
              param: 'newQuestionImage',
              method: 'POST',
              allow: '*.(png|gif|jpg|jpeg)', // allow only images
              allcomplete: function(response) {
                var data = JSON.parse(response);
                scope.question.imageUrl = data.imageURL;
                scope.$apply();
              }
            };
            UIkit.uploadSelect($('#file_upload_' + scope.question.order), settings);
          });
          var selectedOptionId;
          scope.mouseDown = function($event) {
            if ($event.button === 0) {
              selectedOptionId = $event.target.id.substr(0, $event.target.id.indexOf('_'));
              console.log('Circle ', selectedOptionId, ' is selected');
            }
          };
          scope.mouseUp = function($event) {
            if ($event.button === 0) {
              if (selectedOptionId) {
                console.log('Circle ', selectedOptionId, ' is unselected');
                selectedOptionId = null;
              }
            }
          };
          scope.mouseMove = function($event) {
            if ($event.buttons === 0) {
              selectedOptionId = null;
              return;
            }
            if (selectedOptionId) {
              var circleElement = $('#' + selectedOptionId + '_circle');
              var textElement = $('#' + selectedOptionId + '_text');
              circleElement[0].setAttribute('cx', $event.offsetX);
              circleElement[0].setAttribute('cy', $event.offsetY);
              textElement[0].setAttribute('x', $event.offsetX);
              textElement[0].setAttribute('y', $event.offsetY);
              var option = _.find(scope.question.options, function(obj) {
                return obj._id === selectedOptionId;
              });
              if (option) {
                option.svgData.x = $event.offsetX;
                option.svgData.y = $event.offsetY;
              }
            }
          };
        }
      }
    };
  }
}(window.UIkit, window.jQuery));
