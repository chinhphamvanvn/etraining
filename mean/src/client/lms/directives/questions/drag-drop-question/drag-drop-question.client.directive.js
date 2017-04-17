(function(UIkit) {
  'use strict';

  // Drag-Drop Question

  angular
    .module('lms')
    .filter('byGroup', ['_', function(_) {
      return function(options, group) {
        return _.filter(options, function(option) {
          return option.group === group;
        });
      };
    }]);

  angular
    .module('lms')
    .filter('letter', function() {
      return function(index) {
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet[index % alphabet.length];
      };
    });

  angular.module('lms')
    .directive('dragDropQuestion', ['OptionsService', 'QuestionsService', 'fileManagerConfig', '$timeout', '$filter', '_', dragDropQuestion]);

  function dragDropQuestion(OptionsService, QuestionsService, fileManagerConfig, $timeout, $filter, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        shuffle: '=',
        mode: '=' // edit.view/study, result
      },
      templateUrl: '/src/client/lms/directives/questions/drag-drop-question/drag-drop-question.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
        scope.optionById = optionById;
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
              assignOptionIndex();
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
              setupSvgEditor();
              markCorrectAssoc();
              scope.addAssoc = addAssoc;
              scope.removeAssoc = removeAssoc;
              break;
            case 'study':
              setupSvgDragDrop();
              preprocessQuestionContent();
              rearrangeOptions();
              markAnswerAssoc();
              break;
            case 'view':
              preprocessQuestionContent();
              markCorrectAssoc();
              break;
            case 'result':
              preprocessQuestionContent();
              markAnswerAssoc();
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

        function markCorrectAssoc() {
          _.each(scope.question.optionMappings, function(assoc) {
            var option = _.find(scope.question.options, function(obj) {
              return obj._id === assoc.source;
            });
            if (option)
              option.target = assoc.target;
          });
        }

        function markAnswerAssoc() {
          if (scope.answer) {
            _.each(scope.question.options, function(option) {
              var assoc = _.find(scope.answer.optionMappings, function(obj) {
                return obj.source === option._id;
              });
              if (assoc && assoc.source && assoc.target) {
                dropIn(assoc.source, assoc.target);
              }
            });
          }
        }

        function dropIn(sourceId, targetId) {
          var source = _.find(scope.question.options, function(obj) {
            return obj._id === sourceId;
          });
          source.target = targetId;
          var target = _.find(scope.question.options, function(obj) {
            return obj._id === targetId;
          });
          target.source = sourceId;
          source.svgData.x = target.svgData.x;
          source.svgData.y = target.svgData.y;
        }

        function testOverlap(sourceId, targetId) {
          var sourceRectElement = $('#' + sourceId + '_rect');
          var targetRectElement = $('#' + targetId + '_rect');
          var sourceLeft = +sourceRectElement[0].getAttribute('x');
          var sourceTop = +sourceRectElement[0].getAttribute('y');
          var sourceRight = sourceLeft + +sourceRectElement[0].getAttribute('width');
          var sourceBottom = sourceTop + +sourceRectElement[0].getAttribute('height');
          var targetLeft = +targetRectElement[0].getAttribute('x');
          var targetTop = +targetRectElement[0].getAttribute('y');
          var targetRight = targetLeft + +targetRectElement[0].getAttribute('width');
          var targetBottom = targetTop + +targetRectElement[0].getAttribute('height');
          return !(targetLeft > sourceRight ||
          targetRight < sourceLeft ||
          targetTop > sourceBottom ||
          targetBottom < sourceTop);
        }

        function addAssoc() {
          var sourceOption = new OptionsService();
          if (scope.question.options.length === 0)
            sourceOption.order = scope.question.options.length + 1;
          else
            sourceOption.order = _.max(scope.question.options, function(object) { return object.order;}).order + 1;
          sourceOption.group = 'source';
          sourceOption.question = scope.question._id;
          sourceOption.$save(function() {
            scope.question.options.push(sourceOption);
            var targetOption = new OptionsService();
            targetOption.order = _.max(scope.question.options, function(object) { return object.order;}).order + 1;
            targetOption.group = 'target';
            targetOption.question = scope.question._id;
            targetOption.$save(function() {
              scope.question.options.push(sourceOption);
              scope.question.options.push(targetOption);
              sourceOption.svgData = {
                x: 0,
                y: 0
              };
              targetOption.svgData = {
                x: 100,
                y: 0
              };
              scope.question.svgData[sourceOption._id] = sourceOption.svgData;
              scope.question.svgData[targetOption._id] = targetOption.svgData;
              scope.question.optionMappings.push({
                source: sourceOption._id,
                target: targetOption._id
              });
              assignOptionIndex();
            });
          });
        }


        function preprocessQuestionContent() {
        }

        function assignOptionIndex() {
          var targetOptions = _.filter(scope.question.options, function(option) {
            return option.group === 'target';
          });
          _.each(targetOptions, function(option, index) {
            option.index = index;
          });
          var sourceOptions = _.filter(scope.question.options, function(option) {
            return option.group === 'source';
          });
          _.each(sourceOptions, function(option, index) {
            option.index = index;
          });
        }

        function removeAssoc(assoc) {
          scope.question.options = _.reject(scope.question.options, function(o) {
            return o._id === assoc.source;
          });
          scope.question.options = _.reject(scope.question.options, function(o) {
            return o._id === assoc.target;
          });
          scope.question.optionMappings = _.reject(scope.question.optionMappings, function(o) {
            return o.source === assoc.source || o.target === assoc.target;
          });
          OptionsService.delete({
            optionId: assoc.source
          });
          OptionsService.delete({
            optionId: assoc.target
          });
          assignOptionIndex();
        }

        function optionById(id) {
          return _.find(scope.question.options, function(option) {
            return option._id === id;
          });
        }

        function updateSvgData() {
          scope.question.svgData = {};
          _.each(scope.question.options, function(option) {
            scope.question.svgData[option._id] = option.svgData;
          });
        }

        function setupSvgEditor() {
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
            UIkit.uploadSelect($('#file_upload-select'), settings);
          });
          var selectedOption;
          scope.mouseDown = function($event, option) {
            if ($event.button === 0) {
              selectedOption = option;
              console.log('Option ', option, ' is selected');
            }
          };
          scope.mouseUp = function($event, option) {
            if ($event.button === 0) {
              if (option) {
                console.log('Option ', selectedOption, ' is unselected');
                selectedOption = null;
              }
            }
          };
          scope.mouseMove = function($event) {
            if ($event.buttons === 0) {
              selectedOption = null;
              return;
            }
            if (selectedOption) {
              var rectElement = $('#' + selectedOption._id + '_rect');
              var textElement = $('#' + selectedOption._id + '_text');
              rectElement[0].setAttribute('x', $event.offsetX - +rectElement[0].getAttribute('width') / 2);
              rectElement[0].setAttribute('y', $event.offsetY - +rectElement[0].getAttribute('height') / 2);
              selectedOption.svgData.x = $event.offsetX - +rectElement[0].getAttribute('width') / 2;
              selectedOption.svgData.y = $event.offsetY - +rectElement[0].getAttribute('height') / 2;
            }
          };
        }

        function setupSvgDragDrop() {
          scope.dragOption = null;
          scope.dropOption = null;
          scope.mouseDown = function($event, option) {
            var source,
              target;
            if ($event.button === 0) {
              if (option.group === 'source') {
                scope.dragOption = option;
                console.log('Option ', scope.dragOption, ' is selected');
                scope.dropOption = null;
                if (option.target) {
                  target = optionById(source.target);
                  target.source = null;
                  scope.dragOption.target = null;
                }
              }
              if (option.group === 'target' && option.source) {
                scope.dragOption = optionById(option.source);
                console.log('Option ', scope.dragOption, ' is selected');
                scope.dropOption = null;
                option.source = null;
                scope.dragOption.target = null;
              }
            }

          };
          scope.mouseUp = function($event) {
            if ($event.button === 0) {
              if (scope.dragOption) {
                console.log('Option ', scope.dragOption, ' is unselected');
                if (scope.dropOption) {
                  dropIn(scope.dragOption._id, scope.dropOption._id);
                }
              }
              scope.dragOption = null;
              scope.dropOption = null;
            }

          };
          scope.mouseMove = function($event) {
            if ($event.buttons === 0) {
              scope.dragOption = null;
              scope.dropOption = null;
              return;
            }
            if (scope.dragOption) {
              var rectElement = $('#' + scope.dragOption._id + '_rect');
              var option = optionById(scope.dragOption._id);
              option.svgData.x = $event.offsetX - +rectElement[0].getAttribute('width') / 2;
              option.svgData.y = $event.offsetY - +rectElement[0].getAttribute('height') / 2;
              if (!scope.dropOption) {
                // test if any overlap, then set drop ID
                _.each(scope.question.options, function(targetOption) {
                  if (targetOption.group === 'target') {
                    var occupiedOption = _.find(scope.question.options, function(obj) {
                      return obj.target === targetOption._id;
                    });
                    if (!occupiedOption && testOverlap(scope.dragOption._id, targetOption._id))
                      scope.dropOption = targetOption;
                  }
                });
              } else {
                // test if not overlap, then reset drop ID
                if (!testOverlap(scope.dragOption._id, scope.dropOption._id))
                  scope.dropOption = null;
              }
            }
          };
        }
      }
    };
  }
}(window.UIkit));
