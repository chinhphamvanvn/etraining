(function() {
  'use strict';


  angular.module('lms')
    .directive('homeworkSheet', ['QuestionsService', 'AnswersService', '_', homeworkSheet]);

  function homeworkSheet(QuestionsService, AnswersService, _) {
    return {
      scope: {
        mode: '=', // study, mark, result
        attempt: '=',
        questions: '=',
        feedbacks: '=',
        teacher: '='
      },
      templateUrl: '/src/client/lms/directives/homework-sheet/homework.sheet.directive.client.view.html',
      link: function(scope, element, attributes) {
        var answer
        scope.$watchGroup(['attempt', 'questions'], function() {
          if (scope.attempt && scope.questions) {
            if (!scope.attempt._id) {
              _.each(scope.questions, function(question) {
                answer = new AnswersService();
                answer.question = question._id;
                question.answer = answer;
              });
            } else {
              _.each(scope.questions, function(question) {
                answer = _.find(scope.attempt.answers, function(obj) {
                  return obj.question === question._id;
                });
                if (!answer) {
                  answer = new AnswersService();
                  answer.question = question._id;
                  question.answer = answer;
                  question.feedback = _.find(scope.feedbacks, function(obj) {
                    return feedback.answer === answer._id;
                  });
                } else {
                  question.answer = new AnswersService();
                  question.answer = _.extend(question.answer, answer);
                  question.feedback = new FeedbacksService();
                  question.feedback.teacher = scope.teacher;
                  question.feedback.attempt = scope.attempt;
                  question.feedback.feedbackDate = new Date();
                }
              });                
            }
          }
        });
        
        
        scope.clearFeedback = function(question) {
          question.feedback.audioUrl = null;
          question.feedback.videoUrl = null;
          question.feedback.response = '';
          if (question.feedback._id) {
            question.feedback.$update();
          }
        }
        
        scope.saveFeedback = function(question) {
          if (question.feedback._id) {
            question.feedback.$update();
          } else
            question.feedback.$save();
        }
      }
    };
  }
}());
