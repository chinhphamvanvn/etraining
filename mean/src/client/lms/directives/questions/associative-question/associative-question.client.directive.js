(function() {
  'use strict';

  // Associative Question

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
    .directive('associativeQuestion', ['OptionsService', 'QuestionsService', 'fileManagerConfig', '$filter', '_', associativeQuestion]);

  function associativeQuestion(OptionsService, QuestionsService, fileManagerConfig, $filter, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        shuffle: '=',
        mode: '=' // edit.view/study, result
      },
      templateUrl: '/src/client/lms/directives/questions/associative-question/associative-question.directive.client.view.html',
      link: function(scope, element, attributes) {
        function updateTargetList() {
          var targetOptions = _.filter(scope.question.options, function(obj) {
            return obj.group === 'target';
          });
          _.each(targetOptions, function(obj, index) {
            obj.index = index;
          });
          scope.targetOptions = _.map(targetOptions, function(obj) {
            return {
              id: obj._id,
              title: $filter('letter')(obj.index),
              value: obj._id
            };
          });
        }

        scope.tinymce_options = fileManagerConfig;
        scope.targetConfig = {
          maxItems: 1,
          valueField: 'value',
          labelField: 'title',
          searchField: 'title',
          create: false
        };

        scope.$watch('question', function() {
          if (scope.question._id)
            scope.question.options = OptionsService.byQuestion({
              questionId: scope.question._id
            }, function(options) {
              var option;
              updateTargetList();
              // shuffle the question option
              if (scope.mode === 'study' && scope.shuffle) {
                if (!scope.question.shuffleIndex)
                  scope.question.shuffleIndex = Math.floor(Math.random() * options.length);
                scope.question.options = [];
                for (var i = 0; i < options.length; i++)
                  scope.question.options.push(options[(scope.question.shuffleIndex + i) % options.length]);
              }

              if (scope.mode === 'study' && !scope.shuffle) {
                scope.question.options = _.sortBy(scope.question.options, 'order');
              }
              // initialize the option
              if (scope.mode !== 'study' && scope.mode !== 'result') {
                _.each(scope.question.optionMappings, function(assoc) {
                  option = _.find(scope.question.options, function(obj) {
                    return obj._id === assoc.source;
                  });
                  option.target = assoc.target;
                });
              } else {
                if (scope.answer) {
                  _.each(scope.question.options, function(option) {
                    var assoc = _.find(scope.answer.optionMappings, function(obj) {
                      return obj.source === option._id;
                    });
                    if (assoc)
                      option.target = assoc.target;
                  });
                }
              }
            });
          else
            scope.question.options = [];
        });

        scope.getOption = function(id) {
          return _.find(scope.question.options, function(option) {
            return option._id === id;
          });
        };

        scope.addSourceOption = function() {
          var option = new OptionsService();
          if (scope.question.options.length === 0)
            option.order = 1;
          else
            option.order = _.max(scope.question.options, function(object) { return object.order;}).order + 1;
          option.question = scope.question._id;
          option.group = 'source';
          option.$save(function() {
            scope.question.options.push(option);
          });
        };

        scope.addTargetOption = function() {
          var option = new OptionsService();
          if (scope.question.options.length === 0) {
            option.order = 1;
          } else {
            option.order = _.max(scope.question.options, function(object) { return object.order;}).order + 1;
          }
          option.question = scope.question._id;
          option.group = 'target';
          option.$save(function() {
            scope.question.options.push(option);
            updateTargetList();
          });
        };

        scope.selectAssociation = function() {
          if (scope.mode === 'edit') {
            var sourceOptions = _.filter(scope.question.options, function(obj) {
              return obj.group === 'source' && obj.target;
            });
            scope.question.optionMappings = _.map(sourceOptions, function(obj) {
              return {
                source: obj._id,
                target: obj.target
              };
            });
          }
        };


        scope.translateContent = function() {
          return scope.question.description;
        };

        scope.removeOption = function(option) {
          if (option._id) {
            OptionsService.delete({
              optionId: option._id
            }, function() {
              scope.question.options = _.reject(scope.question.options, function(o) {
                return o._id === option._id;
              });
              updateTargetList();
              scope.question.optionMappings = _.reject(scope.question.optionMappings, function(o) {
                return o.source === option._id || o.target === option._id;
              });
            });
          }
        };
      }
    };
  }
}());
