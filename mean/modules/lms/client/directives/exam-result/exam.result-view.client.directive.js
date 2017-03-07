(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('examResult', ['QuestionsService','_',examResult]);

  function examResult(QuestionsService, _) {
      
      return {
          scope: {
              exam: "=",
              answers: "=",
          },
          templateUrl:'/modules/lms/client/directives/exam-result/exam.result.directive.client.view.html',
          link: function (scope, element, attributes) {
              scope.$watch('answers',function() {
                  if (scope.answers)
                      _.each(scope.answers, function(answer) {
                          var question = _.find(scope.exam.questions,function(q) {
                              return q.id == answer.question;
                          });
                          if (question) {
                              question.detail = QuestionsService.get({questionId:question.id});
                              question.answer = answer;
                          }
                      });
              })              
          }
      }
  }
}());
