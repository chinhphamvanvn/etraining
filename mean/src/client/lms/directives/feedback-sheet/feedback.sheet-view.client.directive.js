(function() {
  'use strict';


  angular.module('lms')
    .directive('feedbackSheet', ['QuestionsService', 'AnswersService', 'FeedbacksService', 'Notification', '_', feedbackSheet]);

  function feedbackSheet(QuestionsService, AnswersService, FeedbacksService, Notification, _) {
    return {
      scope: {
        mode: '=', //  mark, result
        attempt: '=',
        questions: '=',
        feedbacks: '=',
        teacher: '='
      },
      templateUrl: '/src/client/lms/directives/feedback-sheet/feedback.sheet.directive.client.view.html',
      link: function(scope, element, attributes) {
        var answer;
        _.each(scope.questions, function(question) {
          answer = _.find(scope.attempt.answers, function(obj) {
            return obj.question === question._id;
          });
          if (answer) {
            question.answer = answer;
            var feedback = _.find(scope.feedbacks, function(obj) {
              return obj.answer === answer._id;
            });
            if (!feedback && scope.mode === 'mark') {
              feedback = new FeedbacksService();
              feedback.teacher = scope.teacher;
              feedback.answer = answer._id;
              feedback.attempt = scope.attempt;
              feedback.feedbackDate = new Date();
            }
            question.feedback = feedback;
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
            question.feedback.$update(function() {
              Notification.success({
                message: '<i class="uk-icon-check"></i> Feedback update successfully!'
              });
            },
              function() {
                Notification.error({
                  message: '<i class="uk-icon-check"></i> Feedback updated failed!'
                });
              });
          } else
            question.feedback.$save(function() {
              Notification.success({
                message: '<i class="uk-icon-check"></i> Feedback saved successfully!'
              });
            },
              function() {
                Notification.error({
                  message: '<i class="uk-icon-check"></i> Feedback saved failed!'
                });
              });
        }
      }
    };
  }
}());
