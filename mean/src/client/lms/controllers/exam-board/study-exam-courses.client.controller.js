(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ExamsStudyController', ExamsStudyController);

  ExamsStudyController.$inject = ['$scope', '$rootScope', '$state', '$window', 'QuestionsService', 'examUtils', 'AnswersService', 'OptionsService', 'Authentication', 'SubmissionsService', 'examResolve', 'Notification', 'scheduleResolve', 'candidateResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function ExamsStudyController($scope, $rootScope, $state, $window, QuestionsService, examUtils, AnswersService, OptionsService, Authentication, SubmissionsService, exam, Notification, schedule, candidate, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.exam = exam;
    vm.candidate = candidate;
    vm.schedule = schedule;
    vm.mark = mark;
    vm.unmark = unmark;
    vm.attemptCount = 0;
    vm.markCount = 0;
    $scope.Math = $window.Math;

    $rootScope.toBarActive = true;
    $rootScope.topMenuActive = true;

    $scope.$on('$destroy', function() {
      $rootScope.toBarActive = false;
      $rootScope.topMenuActive = false;
    });

    examUtils.pendingSubmit(vm.candidate, vm.exam).then(function(progress) {

      if (!progress.pending) {
        if (progress.count >= vm.exam.maxAttempt) {
          vm.alert = $translate.instant('ERROR.EXAM.MAX_ATTEMPT_EXCEED');
          return;
        }
        vm.submit = new SubmissionsService();
        vm.submit.candidate = vm.candidate._id;
        vm.submit.exam = vm.exam._id;
        vm.submit.start = new Date();
        vm.submit.schedule = vm.schedule._id;
        vm.submit.status = 'pending';
        vm.submit.$save();
      } else
        vm.submit = progress.pending;

      var now = new Date();
      var start = new Date(vm.submit.start);
      vm.remainTime = vm.exam.duration * 60 - Math.floor((now.getTime() - start.getTime()) / 1000);

      vm.timeoutToken = $timeout(function() {
        $interval.cancel(vm.intervalToken);
        vm.submit.status = 'completed';
        vm.submit.end = new Date();
        vm.submit.answers = _.map(vm.questions, function(obj) {
          if (obj.answer && obj.answer._id)
            return obj.answer._id;
        });
        vm.submit.$update(function() {
          $state.go('workspace.lms.exams.me');
        });
      }, vm.remainTime * 1000);
      vm.intervalToken = $interval(updateClock, 1000);

      if (vm.exam.questionSelection === 'manual') {
        var questionIds = _.pluck(vm.exam.questions, 'id');
        vm.questions = QuestionsService.byIds({
          questionIds: questionIds
        }, function() {
          _.each(vm.submit.answers, function(answer) {
            var question = _.find(vm.questions, function(q) {
              return q._id === answer.question;
            });
            if (question) {
              question.answer = new AnswersService();
              question.answer = _.extend(question.answer, answer);
            }
          });
          vm.index = 0;
          while (vm.index < vm.questions.length && vm.questions[vm.index].answer)
            vm.index++;
          if (vm.index >= vm.questions.length)
            vm.index = 0;
          if (vm.questions.length > 0)
            selectQuestion(vm.index);
          else
            vm.alert = $translate.instant('ERROR.EXAM.QUESTION_NOT_FOUND');
        });
      }
      if (vm.exam.questionSelection === 'auto') {
        var questionPromises = [];

        _.each(vm.exam.questionCategories, function(category) {
          questionPromises.push(examUtils.questionRandom(category.id, category.level, category.numberQuestion));
        });

        $q.all(questionPromises).then(function(groupQuestionList) {
          vm.questions = [];
          vm.submit.answers = [];
          vm.index = 0;

          _.each(groupQuestionList, function(groupQuestion) {
            vm.questions = vm.questions.concat(groupQuestion);
          });

          if (vm.questions.length > 0)
            selectQuestion(vm.index);
          else
            vm.alert = $translate.instant('ERROR.EXAM.QUESTION_NOT_FOUND');
        }).catch(function() {
          console.log('err get groupQuestionList');
        });
      }
    });

    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;
    vm.submitExam = submitExam;

    function updateClock() {
      vm.remainTime--;
      if (vm.exam.preDueWarning && vm.remainTime === vm.exam.preDue * 60) {
        if (!vm.timeUp)
          UIkit.modal.alert($translate.instant('ALERT.EXAM.TIME_UP', {
            minute: vm.exam.preDue
          }));
        vm.timeUp = true;
      }
    }


    function selectQuestion(index) {
      vm.question = vm.questions[index];
      if (!vm.question.answer) {
        vm.question.answer = new AnswersService();
      }
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

    function submitExam() {
      if (vm.exam.earlySubmitPrevention) {
        var now = new Date();
        var start = new Date(vm.submit.start);
        if (start.getTime() + vm.exam.earlySubmit * 60 * 1000 > now.getTime()) {
          UIkit.modal.alert($translate.instant('ERROR.EXAM.SUBMIT_TOO_EARLY'));
          return;
        }
      }

      save(function() {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
          $interval.cancel(vm.intervalToken);
          $timeout.cancel(vm.timeoutToken);
          vm.submit.status = 'completed';
          vm.submit.end = new Date();
          vm.submit.answers = _.map(vm.questions, function(obj) {
            if (obj.answer && obj.answer._id)
              return obj.answer._id;
          });
          vm.submit.$update(function() {
            $state.go('workspace.lms.exams.me');
          });
        });
      });

    }

    function saveNext() {
      save(function() {
        nextQuestion();
      });
    }

    function savePrev() {
      save(function() {
        prevQuestion();
      });
    }

    function save(callback) {
      var answer = vm.question.answer;
      answer.question = vm.question._id;
      answer.exam = vm.exam._id;
      answer.order = vm.index + 1;
      if (vm.question.type === 'mc' || vm.question.type === 'sc' || vm.question.type === 'tf' || vm.question.type === 'fb' || vm.question.type === 'pic') {
        var selectedOptions = _.filter(vm.question.options, function(option) {
          return option.selected;
        });
        answer.options = _.pluck(selectedOptions, '_id');
        answer.isCorrect = answer.options.length === vm.question.correctOptions.length;
        _.each(vm.question.correctOptions, function(option) {
          if (!_.contains(answer.options, option._id))
            answer.isCorrect = false;
        });
      }
      if (vm.question.type === 'dnd' || vm.question.type === 'as') {
        var sourceOptions = _.filter(vm.question.options, function(option) {
          return option.group === 'source';
        });
        answer.optionMappings = _.map(sourceOptions, function(obj) {
          return { source: obj._id, target: obj.target };
        });
        answer.isCorrect = answer.optionMappings.length === vm.question.optionMappings.length;
        _.each(vm.question.optionMappings, function(assoc) {
          var ansAssoc = _.find(answer.optionMappings, function(ansAssoc) {
            return assoc.source === ansAssoc.source && assoc.target === ansAssoc.target;
          });
          if (!ansAssoc)
            answer.isCorrect = false;
        });
      }
      if ((vm.question.answer.options && vm.question.answer.options.length > 0) || (vm.question.answer.optionMappings && vm.question.answer.optionMappings.length > 0))
        vm.question.attempted = true;
      else
        vm.question.attempted = false;
      vm.attemptCount = _.filter(vm.questions, function(q) {
        return q.attempted;
      }).length;

      if (answer._id)
        answer.$update(function() {
          callback();
        });
      else
        answer.$save(function() {
          vm.submit.answers = _.map(vm.questions, function(obj) {
            if (obj.answer && obj.answer._id)
              return obj.answer._id;
          });
          vm.submit.$update(function() {
            callback();
          });
        });
    }

    function mark(question) {
      question.marked = true;
      vm.markCount = _.filter(vm.questions, function(q) {
        return q.marked;
      }).length;
    }

    function unmark(question) {
      question.marked = false;
      vm.markCount = _.filter(vm.questions, function(q) {
        return q.marked;
      }).length;
    }
  }
}(window.UIkit));
