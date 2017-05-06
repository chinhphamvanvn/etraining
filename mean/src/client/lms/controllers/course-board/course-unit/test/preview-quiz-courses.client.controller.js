(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesPreviewQuizController', CoursesPreviewQuizController);

  CoursesPreviewQuizController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'ExamsService', 'AnswersService', 'OptionsService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesPreviewQuizController($scope, $state, $window, QuestionsService, ExamsService, AnswersService, OptionsService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;

    if (vm.section.quiz) {
      vm.quiz = ExamsService.get({
        examId: vm.section.quiz
      }, function() {
        vm.remainTime = vm.quiz.duration * 60;
        vm.intervalToken = $interval(updateClock, 1000);

        var questionIds = _.pluck(vm.quiz.questions, 'id');
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
          else
            vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
        });
      });

    } else
      vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');

    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;

    function updateClock() {
      vm.remainTime--;
    }

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
