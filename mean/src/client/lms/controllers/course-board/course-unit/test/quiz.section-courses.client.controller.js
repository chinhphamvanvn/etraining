(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesQuizSectionController', CoursesQuizSectionController);

  CoursesQuizSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'editionResolve', 'quizResolve', 'Notification', 'QuestionsService', 'ExamsService', 'EditionSectionsService', '$q', '_'];

  function CoursesQuizSectionController($scope, $state, $window, Authentication, $timeout, course, section, edition, quiz, Notification, QuestionsService, ExamsService, EditionSectionsService, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.edition = edition;
    vm.section = section;
    vm.quiz = quiz;
    vm.addQuestion = addQuestion;
    vm.addGroupQuestion = addGroupQuestion;
    vm.removeQuestion = removeQuestion;
    vm.moveUp = moveUp;
    vm.moveDown = moveDown;
    vm.update = update;
    vm.questions = [];
    vm.selectQuestionGroupManual = selectQuestionGroupManual;
    vm.selectQuestionsLib = selectQuestionsLib;

    _.each(vm.quiz.questions, function(q) {
      var question = QuestionsService.get({
        questionId: q.id
      }, function() {
        question.order = q.order;
        vm.questions.push(question);
      });
    });

    function moveUp(question) {
      var prevQuestion = _.find(vm.questions, function(q) {
        return q.order < question.order;
      });
      if (prevQuestion) {
        var order = question.order;
        question.order = prevQuestion.order;
        prevQuestion.order = order;
      }
    }

    function moveDown(question) {
      var nextQuestion = _.find(vm.questions, function(q) {
        return q.order > question.order;
      });
      if (nextQuestion) {
        var order = question.order;
        question.order = nextQuestion.order;
        nextQuestion.order = order;
      }
    }

    function update() {
      vm.quiz.questions = _.map(vm.questions, function(obj) {
        return {
          id: obj._id,
          score: 1,
          order: obj.order
        };
      });
      var allPromise = [];
      vm.section.html = null;
      vm.section.video = null;
      vm.section.quiz = vm.quiz._id;
      allPromise.push(vm.section.$update().$promise);
      allPromise.push(vm.quiz.$update().$promise);
      _.each(vm.questions, function(question) {
        allPromise.push(QuestionsService.saveRecursive(question).$promise);
      });
      $q.all(allPromise).then(function() {
        $state.go('workspace.lms.courses.section.view.quiz', {
          courseId: vm.course._id,
          sectionId: vm.section._id
        });
      });
    }

    function addQuestion(type) {
      var question = new QuestionsService();
      question.type = type;
      question.$save(function() {
        if (vm.questions.length === 0){
          question.order = vm.questions.length + 1;
        } else {
          question.order = _.max(vm.questions, function(o) { return o.order;}).order + 1;
        }
        vm.questions.push(question);
      });
    }

    function addGroupQuestion() {
      var question = new QuestionsService();
      question.grouped = true;
      if (vm.questions.length === 0)
        question.order = vm.questions.length + 1;
      else
        question.order = _.max(vm.questions, function(o) { return o.order;}).order + 1;
      question.$save(function() {
        vm.questions.push(question);
      });
    }

    function removeQuestion(question) {
      if (question._id) {
        QuestionsService.delete({
          questionId: question._id
        }, function() {
          vm.questions = _.reject(vm.questions, function(o) {
            return o._id === question._id;
          });
        });
      } else
        vm.questions = _.reject(vm.questions, function(o) {
          return o.order === question.order && !o._id;
        });
    }

    function selectQuestionGroupManual(groups) {
      vm.questionsLib = [];
      _.each(groups, function(group) {
        QuestionsService.byCategory({
          groupId: group
        }, function(questions) {
          vm.questionsLib = vm.questionsLib.concat(questions);
        });
      });
    }

    function selectQuestionsLib() {
      if(vm.questionsLib && vm.questionsLib.length > 0) {
        var questionNew = _.filter(vm.questionsLib, function(ques) {
          return ques.selected;
        });
        questionNew.forEach(function(questionLib) {
          var existQues = _.find(vm.questions, function(ques) {
            return ques._id === questionLib._id;
          });
          if(!existQues) {
            if (vm.questions.length === 0){
              questionLib.order = vm.questions.length + 1;
            } else {
              questionLib.order = _.max(vm.questions, function(o) { return o.order;}).order + 1;
            }
            vm.questions.push(questionLib);
          }
        });
      }
    }

  }
}());
