(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('trueFalseQuestion', ['OptionsService','QuestionsService','$translate', '_', trueFalseQuestion]);

  function trueFalseQuestion(OptionsService,QuestionsService,$translate, _) {
      
      return {
          scope: {
              question: "=",
              mode: "="         // edit,view/study
          },
          templateUrl:'/modules/shared/client/directives/true-false-question/true-false-question.directive.client.view.html',
          link: function (scope, element, attributes) {
              if (scope.question._id)
                  scope.question.options = OptionsService.byQuestion({questionId:scope.question._id},function() {
                      if (scope.question.options.length) {
                          _.each(scope.question.options,function(option) {
                              option.isCorrect = _.contains(scope.question.correctOptions,option._id);
                          });
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
       
 
              
              scope.selectOption = function(option) {
                  _.each(scope.question.options,function(obj) {
                     obj.isCorrect = false; 
                  });
                  option.isCorrect = true;
                  scope.question.correctOptions = [option._id];
              }
          }
      }
  }
}());
