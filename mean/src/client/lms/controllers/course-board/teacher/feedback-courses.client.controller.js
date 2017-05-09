(function() {
  'use strict';

  angular
    .module('lms')
    .controller('CoursesExerciseFeedbackController', CoursesExerciseFeedbackController);

  CoursesExerciseFeedbackController.$inject = ['$scope', '$state', '$window', 'Authentication', '$filter', 'editionResolve', 'courseResolve', 'memberResolve', 'Notification', 'CourseMembersService', 'FeedbacksService', 'attemptResolve', 'feedbacksResolve', 'EditionSectionsService', 'exerciseResolve', 'QuestionsService', '$translate', '_'];

  function CoursesExerciseFeedbackController($scope, $state, $window, Authentication, $filter, edition, course, member, Notification, CourseMembersService, FeedbacksService, attempt, feedbacks, EditionSectionsService, exercise, QuestionsService, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.exercise = exercise;
    vm.attempt = attempt;
    vm.feedbacks = feedbacks;
    
    var questionIds = _.pluck(vm.exercise.questions, 'id');
    QuestionsService.byIds({
      questionIds: questionIds
    }, function(questions) {
      questions.reverse();
      vm.questions = questions;
    });
    vm.student = CourseMembersService.get({memberId:vm.attempt.member._id});

  }
}());
