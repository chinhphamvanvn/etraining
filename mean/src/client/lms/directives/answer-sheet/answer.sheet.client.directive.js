(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('answerSheet', ['QuestionsService', '_', answerSheet]);

  function answerSheet(QuestionsService, _) {
    return {
      scope: {
        exam: '=',
        answers: '=',
        sheetId: '='
      },
      templateUrl: '/src/client/lms/directives/answer-sheet/answer.sheet.client.view.html',
      link: function(scope, element, attributes) {
        scope.questions = [];
        if (scope.exam.questionSelection === 'manual') {
          scope.questionNumber = scope.exam.questions.length;
          _.each(scope.answers, function(answer) {
            if (_.find(scope.exam.questions, function(q) {
                return q.id === answer.question;
              })) {
              var question = QuestionsService.get({
                questionId: answer.question
              }, function() {
                question.answer = answer;
                question.order = answer.order;
                scope.questions.push(question);
              });
            }
          });
        } else {
          _.each(scope.answers, function(answer) {
            var question = QuestionsService.get({
              questionId: answer.question
            }, function() {
              question.answer = answer;
              question.order = answer.order;
              scope.questions.push(question);
            });
          });
        }
      }
    };
  }
}());
