(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStudyExerciseController', CoursesStudyExerciseController);

  CoursesStudyExerciseController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'ExercisesService', 'AnswersService', 'OptionsService', 'FeedbacksService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'memberResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesStudyExerciseController($scope, $state, $window, QuestionsService, ExercisesService, AnswersService, OptionsService, FeedbacksService, Authentication, AttemptsService, edition, CoursesService, Notification, section, member, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;

    if (vm.section.exercise) {
      ExercisesService.get({
        exerciseId: vm.section.exercise
      }, function(exercise) {
        var questionIds = _.pluck(exercise.questions, 'id');
        QuestionsService.byIds({
          questionIds: questionIds
        }, function(questions) {
          vm.questions = _.sortBy(questions, function(question) {
            return new Date(question.created).getTime();
          });
        });
        AttemptsService.bySectionAndMember({
          memberId: vm.member._id,
          sectionId: vm.section._id,
          editionId: vm.edition._id
        }, function(attempts) {
          if (attempts.length === 0) {
            vm.attempt = new AttemptsService();
            vm.attempt.section = vm.section._id;
            vm.attempt.edition = vm.edition._id;
            vm.attempt.course = vm.edition.course;
            vm.attempt.member = vm.member._id;
            vm.attempt.status = 'initial';
          } else {
            vm.attempt = attempts[0];
            vm.feedbacks = FeedbacksService.byAttempt({
              attemptId: vm.attempt._id
            });
          }
        });
      });
    }
    
    $scope.$on('$stateChangeStart', function() {
      if (vm.attempt) {
        vm.attempt.status = 'completed';
        vm.attempt.end = new Date();
        if (vm.attempt._id)
          vm.attempt.$update();
        else
          vm.attempt.$save();
      }
    });
  }
}());
