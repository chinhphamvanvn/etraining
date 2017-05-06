(function(UIkit) {
  'use strict';


  angular.module('lms')
    .directive('homeworkSheet', ['QuestionsService', 'AnswersService', '$q', '$translate', 'Notification', '_', homeworkSheet]);

  function homeworkSheet(QuestionsService, AnswersService, $q, $translate, Notification, _) {
    return {
      scope: {
        mode: '=', // study, view
        attempt: '=',
        questions: '=',
      },
      templateUrl: '/src/client/lms/directives/homework-sheet/homework.sheet.directive.client.view.html',
      link: function(scope, element, attributes) {
        _.each(scope.questions, function(question) {
          var answer = _.find(scope.attempt.answers, function(obj) {
            return obj.question === question._id;
          });
          if (!answer && scope.mode === 'study') {
            answer = new AnswersService();
            answer.question = question._id;
            question.answer = answer;
          } else {
            question.answer = new AnswersService();
            question.answer = _.extend(question.answer, answer);
          }
        });

        scope.submitHomework = function() {
          scope.saveHomework(function() {
            UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
              scope.attempt.status = 'completed';
              scope.attempt.end = new Date();
              scope.attempt.$update(function() {
              });
            });
          });
        }

        scope.saveHomework = function(callback) {
          var allPromises = [];
          var answers = _.map(scope.questions, function(q) {
            return q.answer;
          });
          scope.attempt.answers = [];
          _.each(answers, function(answer) {
            if (answer._id)
              answer.$update(function() {
                updateAttempt(answer);
              });
            else
              answer.$save(function() {
                updateAttempt(answer);
              });
          });
          function updateAttempt(answer) {
            scope.attempt.answers.push(answer._id);
            if (scope.attempt.answers.length === answers.length) {
              if (scope.attempt._id)
                scope.attempt.$update(function() {
                  if (callback)
                    callback();
                });
              else
                scope.attempt.$save(function() {
                  if (callback)
                    callback();
                });
            }
          }
        }
      }
    };
  }
}(window.UIkit));
