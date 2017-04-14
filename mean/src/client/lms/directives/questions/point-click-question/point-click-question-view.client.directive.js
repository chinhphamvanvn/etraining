(function(UIkit, $) {
  'use strict';

  // Point-click Question

  angular.module('lms')
    .directive('pointClickQuestion', ['OptionsService', 'QuestionsService', 'fileManagerConfig', '_', pointClickQuestion]);

  function pointClickQuestion(OptionsService, QuestionsService, fileManagerConfig, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        shuffle: '=',
        mode: '=' // edit.view/study, result
      },
      templateUrl: '/src/client/lms/directives/questions/point-click-question/point-click-question.directive.client.view.html',
      link: function(scope, element, attributes) {
        var progressbar = angular.element(document.getElementById('file_upload-progressbar')),
        bar = angular.element(document.getElementById('progress_bar')),
        settings = {
          action: '/api/videos/upload', // upload url
          param: 'newCourseVideo',
          method: 'POST',

          allow: '*.(mp3|mp4|webm|mov|avi|flv|mpeg)', // allow only images

          loadstart: function() {
            bar.css('width', '0%').text('0%');
            progressbar.removeClass('uk-hidden');
            scope.videoAttr = {
              autoplay: false,
              controls: false,
              muted: true
            };
            scope.showProgress = true;
            scope.$apply();
          },

          progress: function(percent) {
            percent = Math.ceil(percent);
            bar.css('width', percent + '%').text(percent + '%');
          },

          allcomplete: function(response) {

            bar.css('width', '100%').text('100%');

            setTimeout(function() {
              progressbar.addClass('uk-hidden');
            }, 250);
            var data = JSON.parse(response);
            scope.video.videoURL = data.videoURL;
            console.log(scope.video);
            scope.videoAttr = {
              autoplay: true,
              controls: true,
              muted: false
            };
            scope.showProgress = false;
            scope.$apply();
          }
        };

      var select = UIkit.uploadSelect($('#file_upload-select'), settings),
        drop = UIkit.uploadDrop($('#file_upload-drop'), settings);
        /*var settings = {
            action: '/api/questions/image/upload', // upload url
            param: 'newQuestionImage',
            method: 'POST',

            allow: '*.(png|gif|jpg|jpeg)', // allow only images
            
            loadstart: function() {
            },

            progress: function(percent) {
            },

            allcomplete: function(response) {
              var data = JSON.parse(response);
              console.log(data);
              scope.$apply();
            }
          };
        UIkit.uploadSelect($('#file_upload-select'), settings);*/
        
        scope.tinymce_options = fileManagerConfig;
        scope.$watch('question', function() {
          if (scope.question._id)
            scope.question.options = OptionsService.byQuestion({
              questionId: scope.question._id
            }, function(options) {
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
          else
            scope.question.options = [];
        });

        scope.translateContent = function() {
          return scope.question.description;
        };

        scope.addOption = function() {
          var option = new OptionsService();
          if (scope.question.options.length === 0)
            option.order = scope.question.options.length + 1;
          else
            option.order = _.max(scope.question.options, function(object) {return object.order;}).order + 1;
          option.question = scope.question._id;
          option.$save(function() {
            scope.question.options.push(option);
          });
        };

        scope.selectOption = function(option) {
          _.each(scope.question.options, function(obj) {
            if (obj._id !== option._id)
              obj.selected = false;
          });
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
            });
          }
        };
      }
    };
  }
}(window.UIkit, window.jQuery));
