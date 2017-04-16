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
        function updateSvgData() {
          scope.question.svgData = {};
          _.each(scope.question.options, function(option) {
            scope.question.svgData[option._id] = option.svgData;
          });
        }
        scope.tinymce_options = fileManagerConfig;
        scope.$watch('question', function() {
          if (scope.question._id) {
            scope.question.options = OptionsService.byQuestion({
              questionId: scope.question._id
            }, function(options) {
              if (scope.question.svgData) {
                scope.question.svgData = angular.fromJson(scope.question.svgData);
                _.each(scope.question.svgData, function(svgData, optionId) {
                  var option = _.find(scope.question.options, function(obj) {
                    return obj._id === optionId;
                  });
                  if(option)
                    option.svgData = svgData;
                });
              }
              else
                scope.question.svgData = {};
              
              if (scope.mode === 'edit') {
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
                var selectedOptionId;
                scope.mouseDown = function($event) {
                  if ($event.button == 0 ) {
                    selectedOptionId = $event.target.id.substr(0, $event.target.id.indexOf('_'));
                    console.log('Circle ',selectedOptionId,' is selected');
                  }
                };
                scope.mouseUp = function($event) {
                  if ($event.button == 0 ) {
                    if (selectedOptionId) {
                      console.log('Circle ',selectedOptionId,' is unselected');  
                      selectedOptionId = null;
                    }
                  }
                };
                scope.mouseMove = function ($event) {
                  if (selectedOptionId) {
                    var circleElement = $('#'+selectedOptionId+"_circle");
                    var textElement = $('#'+selectedOptionId+"_text");                    
                    circleElement[0].setAttribute("cx", $event.offsetX);
                    circleElement[0].setAttribute("cy", $event.offsetY);
                    textElement[0].setAttribute("x", $event.offsetX);
                    textElement[0].setAttribute("y", $event.offsetY);
                    var option = _.find(scope.question.options, function(obj) {
                      return obj._id === selectedOptionId;
                    });
                    if(option) {
                      option.svgData.x = $event.offsetX;
                      option.svgData.y = $event.offsetY;
                    }
                  }
                };
              }
              
              if (scope.mode === 'study' && scope.shuffle) {
                if (!scope.question.shuffleIndex) {
                  scope.question.shuffleIndex = Math.floor(Math.randomw() * options.length);
                }
                scope.question.options = [];
                for (var i = 0; i < options.length; i++)
                  scope.question.options.push(options[(scope.question.shuffleIndex + i) % options.length]);           
              }
              if (scope.mode === 'study' && !scope.shuffle) {
                scope.question.options = _.sortBy(scope.question.options, 'order');
              }
              if (scope.mode !== 'study' && scope.mode !== 'result') {
                _.each(scope.question.options, function(option) {
                  option.selected = _.contains(scope.question.correctOptions, option._id);
                });
              } else {
                if (scope.answer) {
                  _.each(scope.question.options, function(option) {
                    option.selected = _.contains(scope.answer.options, option._id);
                  });
                }
                _.each(scope.question.options, function(option) {
                  option.isCorrect = _.contains(scope.question.correctOptions, option._id);
                });
              }
            });
          } else {
            scope.question.options = [];
          }
          
        });

        scope.translateContent = function() {
          return scope.question.description;
        };

        scope.addOption = function() {
          var option = new OptionsService();
          if (scope.question.options.length === 0)
            option.order = scope.question.options.length + 1;
          else
            option.order = _.max(scope.question.options, function(object) {
                return object.order;
              }).order + 1;
          option.question = scope.question._id;
          option.$save(function() {
            scope.question.options.push(option);
            option.svgData = { x: 100, y: 100}
            updateSvgData();
          });
        };

        scope.selectOption = function(option) {
          _.each(scope.question.options, function(obj) {
            if (obj._id !== option._id)
              obj.selected = false;
          });
          option.selected = true;
          if (scope.mode === 'edit') {
            var correctOptions = _.filter(scope.question.options, function(option) {
              return option.selected;
            });
            scope.question.correctOptions = _.pluck(correctOptions, '_id');
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
              scope.question.correctOptions = _.reject(scope.question.correctOptions, function(o) {
                return o === option._id;
              });
              _.each(scope.question.options, function(option, index) {
                option.order = index + 1;
              });
              updateSvgData();
            });
          }
        };
      }
    };
  }
}(window.UIkit, window.jQuery));
