(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ExamsStudyController', ExamsStudyController);

ExamsStudyController.$inject = ['$scope', '$state', '$window', 'QuestionsService','ExamsService','AnswersService', 'OptionsService','EditionSectionsService','Authentication','AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','memberResolve','$timeout', '$interval','$translate', '$q','_'];

function ExamsStudyController($scope, $state, $window, QuestionsService,ExamsService,AnswersService,OptionsService,EditionSectionsService, Authentication, AttemptsService,edition, CoursesService, Notification, section,member,$timeout, $interval,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    vm.completeCourse = false; // Value base $scope.$parent.endCourse
    if (vm.member.enrollmentStatus == 'completed') {
      vm.alert = $translate.instant('ERROR.COURSE_STUDY.COURSE_ALREADY_COMPLETE');
      return;
    }
    if (vm.section.quiz) {
      vm.quiz = ExamsService.get({examId: vm.section.quiz}, function () {
        vm.attempts = AttemptsService.byMember({memberId: vm.member._id}, function () {
          var attemptCount = _.filter(vm.attempts, function (att) {
            return att.section == vm.section._id
          }).length;
          if (attemptCount >= vm.quiz.maxAttempt && vm.quiz.maxAttempt > 0) {
            vm.alert = $translate.instant('ERROR.COURSE_STUDY.MAX_ATTEMPT_EXCEED');
          } else {
            vm.attempt = new AttemptsService();
            vm.attempt.section = vm.section._id;
            vm.attempt.edition = vm.edition._id;
            vm.attempt.course = vm.edition.course;
            vm.attempt.member = vm.member._id;
            vm.attempt.status = 'initial';
            vm.attempt.$save();
            vm.remainTime = vm.quiz.duration * 60;
            vm.timeoutToken = $timeout(function () {
              $interval.cancel(vm.intervalToken);
              vm.attempt.status = 'completed';
              vm.attempt.end = new Date();
              vm.attempt.answers = _.pluck(vm.questions, 'answer._id');
              vm.attempt.$update(function () {
                $scope.$parent.nextSection();
              });
            }, vm.remainTime * 1000);
            vm.intervalToken = $interval(updateClock, 1000);

            var allPromise = [];
            _.each(vm.quiz.questions, function (q, index) {
              allPromise.push(QuestionsService.get({questionId: q.id}).$promise);
            });
            $q.all(allPromise).then(function (questions) {
              vm.questions = questions;
              vm.index = 0;
              if (vm.questions.length > 0)
                selectQuestion(vm.index)
              else
                vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
            });
          }
        });
      })
    } else
      vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');

    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;
    vm.submitQuiz = submitQuiz;

    function updateClock() {
      vm.remainTime--;
    }


    function selectQuestion(index) {
        vm.question = vm.questions[index];
        vm.options =  OptionsService.byQuestion({questionId:vm.question._id}, function(){
        });
        if(!vm.question.options || vm.question.options.length == 0) {
          vm.question.options = vm.options;
          _.map(vm.question.options, function(item) {
            item.isCorrect = false;
          });
        }

        if (!vm.question.answer) {
            vm.question.answer =  new AnswersService();
        }

      if (vm.question.answer.option || vm.question.answer.options)
        vm.question.attempted = true;
      else
        vm.question.attempted = false;
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

    function submitQuiz() {
      save(function () {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function () {
          vm.attempt.status = 'completed';
          vm.attempt.end = new Date();
          vm.attempt.answers = _.map(vm.questions, function (obj) {
            return obj.answer._id;
          });
          vm.attempt.$update(function () {
            $interval.cancel(vm.intervalToken);
            $timeout.cancel(vm.timeoutToken);

            if (!$scope.$parent.endCourse) {
              $scope.$parent.nextSection();
            } else {
              vm.completeCourse = true;
            }
          });
        });
      })

    }

    function saveNext() {
      save(function () {
        nextQuestion();
      })
    }

    function savePrev() {
      save(function () {
        prevQuestion();
      })
    }

    function save(callback) {
      var answer = vm.question.answer;
      answer.question = vm.question._id;
      answer.exam = vm.quiz._id;
      if (vm.question.type == 'mc' || vm.question.type == 'sc' || vm.question.type == 'tf' || vm.question.type == 'fb') {
        var selectedOptions = _.filter(vm.question.options, function (option) {
          return option.selected;
        });
        answer.options = _.pluck(selectedOptions, '_id');
        answer.isCorrect = _.filter(selectedOptions, function (option) {
            return !_.contains(vm.question.correctOptions, option._id);
          }).length == 0 && selectedOptions.length;
      }
      if (answer._id)
        answer.$update(function () {
          callback();
        });
      else
        answer.$save(function () {
          callback();
        })
    }

    vm.nextSection = $scope.$parent.nextSection;
    vm.prevSection = $scope.$parent.prevSection;

  }
}());