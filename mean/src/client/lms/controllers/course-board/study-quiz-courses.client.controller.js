(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStudyQuizController', CoursesStudyQuizController);

  CoursesStudyQuizController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'ExamsService', 'AnswersService', 'OptionsService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'memberResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesStudyQuizController($scope, $state, $window, QuestionsService, ExamsService, AnswersService, OptionsService, EditionSectionsService, Authentication, AttemptsService, edition, CoursesService, Notification, section, member, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    vm.startStudy = startStudy;
    vm.completeCourse = false; // Value base $scope.$parent.endCourse
    vm.startQuiz = false;

    if (vm.member.enrollmentStatus === 'completed') {
      vm.alert = $translate.instant('ERROR.COURSE_STUDY.COURSE_ALREADY_COMPLETE');
      return;
    }

    function startStudy() {
      vm.startQuiz = true;
      if (vm.section.quiz) {
        vm.quiz = ExamsService.get({
          examId: vm.section.quiz
        }, function() {
          vm.attempts = AttemptsService.byMember({
            memberId: vm.member._id
          }, function() {
            var attemptCount = _.filter(vm.attempts, function(att) {
              return att.section === vm.section._id;
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
              vm.timeoutToken = $timeout(function() {
                $interval.cancel(vm.intervalToken);
                vm.attempt.status = 'completed';
                vm.attempt.end = new Date();
                vm.attempt.answers = _.pluck(vm.questions, 'answer._id');
                vm.attempt.$update(function() {
                  $scope.$parent.nextSection();
                });
              }, vm.remainTime * 1000);
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
            }
          });
        });
      } else
        vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
    }


    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;
    vm.submitQuiz = submitQuiz;

    function updateClock() {
      vm.remainTime--;
    }

    function selectQuestion(index) {
      if (!vm.questions[index].answer) {
        var answer =  new AnswersService(); 
        answer.question = vm.questions[vm.index]._id;
        answer.exam = vm.quiz._id;
        answer.order = vm.index + 1;
        if (vm.questions[index].grouped)
          answer.subAnswers = [];
        answer.$save(function() {
          vm.questions[index].answer =  answer;
          vm.question = vm.questions[index];
        });
      } else {
        vm.question = vm.questions[index];
      }
    }

    function nextQuestion() {
      if (vm.question.grouped) {
        if (vm.subIndex + 1 < vm.question.subQuestions.length) {
          vm.subIndex++;
          selectQuestion(vm.index);
          return;
        } else
          vm.subIndex = 0;
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
          selectQuestion(vm.index);
          return;
        } else
          vm.subIndex = 0;
      }
      if (vm.index > 0) {
        vm.index--;
        selectQuestion(vm.index);
      }
    }

    function submitQuiz() {
      save(function() {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
          vm.attempt.status = 'completed';
          vm.attempt.end = new Date();
          vm.attempt.answers = _.map(vm.questions, function(obj) {
            return obj.answer._id;
          });
          vm.attempt.$update(function() {
            $interval.cancel(vm.intervalToken);
            $timeout.cancel(vm.timeoutToken);

            if (!$scope.$parent.endCourse) {
              $scope.$parent.nextSection();
            } else {
              vm.completeCourse = true;
            }
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
    
    function collectAnswer(answer, question) {
      if (question.type === 'mc' || question.type === 'sc' || question.type === 'tf' || question.type === 'fb' || question.type === 'pic') {
        var selectedOptions = _.filter(question.options, function(option) {
          return option.selected;
        });
        answer.options = _.pluck(selectedOptions, '_id');
        answer.isCorrect = answer.options.length === question.correctOptions.length;
        _.each(question.correctOptions, function(option) {
          if (!_.contains(answer.options, option))
            answer.isCorrect = false;
        });
      }
      if (question.type === 'dnd' || question.type === 'as') {
        var sourceOptions = _.filter(question.options, function(option) {
          return option.group === 'source';
        });
        answer.optionMappings = _.map(sourceOptions, function(obj) {
          return { source: obj._id, target: obj.target };
        });
        answer.isCorrect = answer.optionMappings.length === question.optionMappings.length;
        _.each(question.optionMappings, function(assoc) {
          var ansAssoc = _.find(answer.optionMappings, function(ansAssoc) {
            return assoc.source === ansAssoc.source && assoc.target === ansAssoc.target;
          });
          if (!ansAssoc)
            answer.isCorrect = false;
        });
      }
    }

    function save(callback) {
      var answer = vm.question.answer;
      if (vm.question.grouped) {
        var subAnswer = _.find(answer.subAnswers, function(obj) {
          return vm.question.subQuestions[vm.subIndex]._id === obj.question;
        });
        if (!subAnswer) {
          subAnswer = new AnswersService();
          subAnswer.question = vm.question.subQuestions[vm.subIndex]._id;
          collectAnswer(subAnswer, vm.question.subQuestions[vm.subIndex]);
          subAnswer.$save(function() {
            answer.subAnswers.push(subAnswer);
            answer.$update(function() {
              callback();
            })
          });
        } else {
          collectAnswer(subAnswer, vm.question.subQuestions[vm.subIndex]);
          subAnswer.$update(function() {
              callback();
          });
        }
      } else {
        collectAnswer(answer, vm.question);
        if ((vm.question.answer.options && vm.question.answer.options.length > 0) || (vm.question.answer.optionMappings && vm.question.answer.optionMappings.length > 0))
          vm.question.attempted = true;
        else
          vm.question.attempted = false;
        answer.$update(function() {
          callback();
        });
      }
    }

    vm.nextSection = $scope.$parent.nextSection;
    vm.prevSection = $scope.$parent.prevSection;

  }
}(window.UIkit));
