(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('multipleChoiceQuestion', ['OptionsService','QuestionsService','_', multipleChoiceQuestion]);

  function multipleChoiceQuestion(OptionsService,QuestionsService,_) {
      
      return {
          scope: {
              question: "=",
              mode: "="         // edit.view/study
          },
          templateUrl:'/modules/shared/client/directives/multiple-choice-question/multiple-choice-question.directive.client.view.html',
          link: function (scope, element, attributes) {
              if (scope.question._id)
                  scope.question.options = OptionsService.byQuestion({questionId:scope.question._id},function() {
                      _.each(scope.question.options,function(option) {
                          option.isCorrect = _.contains(scope.question.correctOptions,option._id);
                      });
                  });
              else
                  scope.question.options = [];
              
              scope.addOption = function() {
                  var option = new OptionsService();
                  if (scope.question.options.length==0)
                      option.order = scope.question.options.length +1;
                  else
                      option.order =  _.max(scope.question.options, function(object){return object.order}).order+1;
                  option.question = scope.question._id;
                  option.$save(function() {
                      scope.question.options.push(option);
                  });
              }
              
              scope.selectOption = function(option) {
                  scope.question.correctOptions = [];
                  _.each(scope.question.options,function(obj) {
                     if (obj.isCorrect)
                         scope.question.correctOptions.push(obj._id);
                  });                  
              }
              
              scope.removeOption = function(option) {
                  if (option._id)  {
                      OptionsService.delete({optionId:option._id},function() {
                          scope.question.options = _.reject(scope.question.options,function(o) {
                              return o._id == option._id;
                          })
                          scope.question.correctOptions = _.reject(scope.question.correctOptions,function(o) {
                              return o == option._id;
                          })
                      })                      
                  } 
              }
          }
      }
  }
}());
