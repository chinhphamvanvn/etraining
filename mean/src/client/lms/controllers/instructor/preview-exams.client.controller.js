(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ExamsPreviewController', ExamsPreviewController);

  ExamsPreviewController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'ExamsService', 'examUtils', 'OptionsService', 'Authentication', 'scheduleResolve', 'Notification', 'examResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function ExamsPreviewController($scope, $state, $window, QuestionsService, ExamsService, examUtils, OptionsService, Authentication, schedule, Notification, exam, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.remainTime = vm.exam.duration * 60;
    vm.intervalToken = $interval(updateClock, 1000);

    if (vm.exam.questionSelection === 'manual') {
      var questionIds = _.pluck(vm.exam.questions, 'id');
      vm.questions = QuestionsService.byIds({
        questionIds: questionIds
      }, function() {
        vm.index = 0;
        if (vm.questions.length > 0)
          selectQuestion(vm.index);
        else
          vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
      });
    }
    if (vm.exam.questionSelection === 'auto') {

      var questionPromises = [];

      _.each(vm.exam.questionCategories, function(category) {
          questionPromises.push(examUtils.questionRandom(category.id, category.level, category.numberQuestion));
      });

      $q.all(questionPromises).then(function(groupQuestionList) {
          vm.questions = [];
          vm.index = 0;

          _.each(groupQuestionList, function(groupQuestion) {
              vm.questions = vm.questions.concat(groupQuestion);
          });

          if (vm.questions.length > 0)
              selectQuestion(vm.index);
          else
              vm.alert = $translate.instant('ERROR.EXAM.QUESTION_NOT_FOUND');
      }).catch(function(err) {
          console.log(err);
      });
    }

    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;

    function isParent(parentId, childGroup, groups) {
      if (!parentId)
        return true;
    }

    function updateClock() {
      vm.remainTime--;
      function pad(num) {
        return ('0' + num).slice(-2);
      }
      var hh = Math.floor(vm.remainTime / 3600);
      var mm = Math.floor((vm.remainTime - hh * 3600) / 60);
      var ss = Math.floor(vm.remainTime - hh * 3600 - mm * 60);
      vm.timeString = pad(hh) + ':' + pad(mm) + ':' + pad(ss);
    }

    function selectQuestion(index) {
      vm.question = vm.questions[index];
      vm.options = OptionsService.byQuestion({
        questionId: vm.question._id
      }, function() {});
    }

    function nextQuestion() {
      if (vm.index + 1 < vm.questions.length) {
        vm.index++;
        selectQuestion(vm.index);
      }
    }
    function prevQuestion() {
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
