(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('lmsQuestion', ['OptionsService','QuestionsService','_', lmsQuestion]);

  function lmsQuestion(OptionsService,QuestionsService,_) {
      
      return {
          scope: {
              question: "=",
              mode: "="
          },
          templateUrl:'/modules/lms/client/directives/question-edit/question.directive.client.view.html',
          link: function (scope, element, attributes) {
              if (scope.question._id)
                  scope.question.options = OptionsService.byQuestion({questionId:scope.question._id});
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
                      option.isCorrect = false;
                      scope.question.options.push(option);
                  });
              }
              
              scope.removeOption = function(option) {
                  if (option._id)  {
                      OptionsService.delete({optionId:option._id},function() {
                          scope.question.options = _.reject(scope.question.options,function(o) {
                              return o._id == option._id;
                          })
                      })                      
                  } else
                      scope.question.options = _.reject(scope.question.options,function(o) {
                          return o.order == option.order && !o._id;
                      })
              }
          }
      }
  }
}());
