(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('answerSheet', ['QuestionsService','_',answerSheet]);

  function answerSheet(QuestionsService, _) {
      
      return {
          scope: {
              exam: "=",
              answers: "=",
          },
          templateUrl:'/modules/lms/client/directives/answer-sheet/answer.sheet.directive.client.view.html',
          link: function (scope, element, attributes) {
              scope.modalId = (new Date()).getTime();
              scope.questions = [];
              scope.$watch('answers',function() {
                  if (scope.answers) {
                      _.each(scope.answers, function(answer) {
                          if (_.find(scope.exam.questions,function(q) {
                              return q.id == answer.question;
                          }) ) {
                              var question = QuestionsService.get({questionId:answer.question},function() {
                                  question.answer = answer;
                                  scope.questions.push(question);
                              } );
                          }
                          
                      });
                  }
              })              
          }
      }
  }
}());
