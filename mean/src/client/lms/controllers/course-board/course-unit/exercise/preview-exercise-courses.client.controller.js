(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesPreviewExerciseController', CoursesPreviewExerciseController);

  CoursesPreviewExerciseController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'ExercisesService', 'AnswersService', 'OptionsService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesPreviewExerciseController($scope, $state, $window, QuestionsService, ExercisesService, AnswersService, OptionsService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;

    if (vm.section.exercise) {
      vm.exercise = ExercisesService.get({
        exerciseId: vm.section.exercise
      }, function() {
        var questionIds = _.pluck(vm.exercise.questions, 'id');
        vm.questions = QuestionsService.byIds({
          questionIds: questionIds
        }, function() {
          vm.questions = _.sortBy(vm.questions, function(question) {
            return new Date(question.created).getTime();
          });
          vm.index = 0;
          vm.subIndex = 0;
          if (vm.questions.length > 0)
            selectQuestion(vm.index);
        });
      });
    }
    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;

    function selectQuestion(index) {
      vm.question = vm.questions[index];
    }

    function nextQuestion() {
      if (vm.question.grouped) {
        if (vm.subIndex + 1 < vm.question.subQuestions.length) {
          vm.subIndex++;
          return;
        }
      }
      if (vm.index + 1 < vm.questions.length) {
        vm.index++;
        selectQuestion(vm.index);
      }
    }
    function prevQuestion() {
      if (vm.question.grouped) {
        if (vm.subIndex > 0) {
          vm.subIndex--;
          return;
        }
      }
      if (vm.index > 0) {
        vm.index--;
        selectQuestion(vm.index);
      }
    }


    function saveNext() {
      nextQuestion();
    }

    function savePrev() {
      prevQuestion();
    }


  }
}());
