(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('trueFalseQuestion', ['OptionsService','QuestionsService','fileManagerConfig','$translate', '_', trueFalseQuestion]);

  function trueFalseQuestion(OptionsService,QuestionsService,fileManagerConfig,$translate, _) {
      
      return {
          scope: {
              question: "=",
              answer:"=",
              shuffle:"=",
              showAnswer:"=",
              mode: "="         // edit.view/study, result
          },
          templateUrl:'/modules/lms/client/directives/true-false-question/true-false-question.directive.client.view.html',
          link: function (scope, element, attributes) {
              scope.tinymce_options = fileManagerConfig;
              scope.$watch('question',function() {
                  if (scope.question._id)
                      scope.question.options = OptionsService.byQuestion({questionId:scope.question._id},function(options) {
                          if (scope.mode =='study' && scope.shuffle) {
                              if (!question.shuffleIndex)
                                  question.shuffleIndex = Math.floor(Math.random()*options.length);
                              scope.question.options = [];
                              for (var i=0;i<options.length;i++)
                                  scope.question.options.push(options[(question.shuffleIndex + i) % options.length])
                          }
                          
                          if (scope.question.options.length) {
                              if (scope.mode !='study' && scope.mode !='result')
                                  _.each(scope.question.options,function(option) {
                                      option.selected = _.contains(scope.question.correctOptions,option._id);
                                  })
                              else {
                                  if (scope.answer) {
                                      _.each(scope.question.options ,function(option) {
                                          option.selected = _.contains(scope.answer.options,option._id)
                                      });
                                  }
                                  _.each(scope.question.options ,function(option) {
                                      option.isCorrect = _.contains(scope.question.correctOptions,option._id);
                                  });
                               }
                          } else {
                              var option1 =  new OptionsService();
                              option1.order  = 1;
                              option1.question = scope.question._id;
                              option1.content = $translate.instant('COMMON.TRUE');
                              option1.$save(function() {
                                  scope.question.options.push(option1);
                              });
                              var option2 =  new OptionsService();
                              option2.order  = 2;
                              option2.question = scope.question._id;
                              option2.content = $translate.instant('COMMON.FALSE');
                              option2.$save(function() {
                                  scope.question.options.push(option2);
                              });
                          }
                      });
              })
              
             
              scope.selectOption = function(option) {
                  _.each(scope.question.options,function(obj) {
                      if (obj._id != option._id)
                          obj.selected = false; 
                  });
                  option.selected = true;
                  if (scope.mode =='edit')
                      scope.question.correctOptions = [option._id];
              }

              scope.translateContent = function() {
                  return scope.question.description.replace("#BLANK#", "<u>&nbsp;&nbsp;&nbsp;&nbsp;</u>");
              }
          }
      }
  }
}());
