(function () {
  'use strict';

// Courses controller
  angular
    .module('lms')
    .controller('ExamsController', ExamsController);

  ExamsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve', 'scheduleResolve', 'Notification', 'QuestionsService', 'ExamsService', 'examUtils', 'GroupsService', '$q', 'fileManagerConfig', '_', '$translate'];

  function ExamsController($scope, $state, $window, Authentication, $timeout, exam, schedule, Notification, QuestionsService, ExamsService, examUtils, GroupsService, $q, fileManagerConfig, _, $translate) {
    var vm = this;
    vm.authentication = Authentication;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.removeQuestion = removeQuestion;
    vm.selectQuestions = selectQuestions;
    vm.selectQuestionGroup = selectQuestionGroup;
    vm.moveUp = moveUp;
    vm.moveDown = moveDown;
    vm.update = update;
    vm.groups = [];
    vm.questions = [];
    vm.groupIds = [];
    vm.tinymce_options = fileManagerConfig;
    var numberQuestionTooLarge = $translate.instant('ERROR.EXAM.NUMBER_QUESTION_TOO_LARGE');

    if (vm.exam.questionSelection === 'auto') {
      _.each(vm.exam.questionCategories, function(category) {
        vm.groupIds.push(category.id);
      });
      selectQuestionGroup(vm.groupIds);
    }

    vm.groupConfig = {
      plugins : {
        'remove_button' : {
          label : ''
        }
      },
      maxItems : null,
      valueField : 'value',
      labelField : 'title',
      searchField : 'title',
      create : false
    };
    vm.groupOptions = [];
    GroupsService.listQuestionGroup(function (data) {
      vm.groupOptions = _.map(data, function (obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        }
      });
    });

    vm.selectedQuestions = [];
    var selectedIds = _.pluck(vm.exam.questions, 'id');
    if (selectedIds.length)
      vm.selectedQuestions = QuestionsService.byIds({questionIds: _.pluck(vm.exam.questions, 'id')}, function () {
        _.each(vm.selectedQuestions, function (question) {
          var examQuestion = _.find(vm.exam.questions, function (q) {
            return q.id == question._id;
          });
          question.score = examQuestion.score;
          question.order = examQuestion.order;
        });
      });

    function moveUp(question) {
      var prevQuestion = _.find(vm.selectedQuestions, function (q) {
        return q.order < question.order;
      });
      if (prevQuestion) {
        var order = question.order;
        question.order = prevQuestion.order;
        prevQuestion.order = order;
      }
    }

    function moveDown(question) {
      var nextQuestion = _.find(vm.selectedQuestions, function (q) {
        return q.order > question.order;
      });
      if (nextQuestion) {
        var order = question.order;
        question.order = nextQuestion.order;
        nextQuestion.order = order;
      }
    }


    function update() {
      if (vm.exam.questionSelection === 'auto') {
        if (!validationNumberQuestion(vm.groups)) {
          Notification.error({message: numberQuestionTooLarge});
          return;
        }

        vm.exam.questionCategories = [];
        _.each(vm.groups, function(group) {
          var obj = {
            id: group.id,
            title: group.title,
            level: group.level,
            numberQuestion: group.numberQuestion
          };

          vm.exam.questionCategories.push(obj);
        });
      }

      vm.exam.questions = _.map(vm.selectedQuestions, function (q) {
        return {id: q._id, order: q.order, score: q.score}
      });

      vm.exam.$update(function () {
          Notification.success({message: '<i class="uk-icon-check"></i> Exam saved successfully!'});
          $state.go('workspace.lms.exams.view', {examId: vm.exam._id, scheduleId: vm.schedule._id})
        },
        function () {
          Notification.success({message: '<i class="uk-icon-check"></i> Exam saved failed!'});
        });
    }

    function validationNumberQuestion(groups) {
      var valid = true;

      for (var i = 0; i < groups.length; i++) {
        if (groups[i].level === 'easy'
          && (groups[i].numberQuestion > groups[i].questions.easy.length)) {
          valid = false;
          break;
        } else if (groups[i].level === 'medium'
          && (groups[i].numberQuestion > groups[i].questions.medium.length)) {
          valid = false;
          break;
        } else if (groups[i].level === 'hard'
          && (groups[i].numberQuestion > groups[i].questions.hard.length)) {
          valid = false;
          break;
        }
      }

      return valid;
    }

    function selectQuestions() {
      _.each(vm.questions, function (question) {
        if (question.selected) {
          if (!_.find(vm.selectedQuestions, function (q) {
              return q._id == question._id;
            })) {
            question.score = 1;
            question.order = vm.selectedQuestions.length + 1;
            vm.selectedQuestions.push(question);
          }
        }
      })
    }

    function selectQuestionGroup(groupIds) {
      var groups = [];
      var groupPromises = [];
      _.each(groupIds, function(groupId) {
        groupPromises.push(QuestionsService.byCategory({groupId: groupId}, function(questions) {
          var questionByLevel = examUtils.countQuestionByLevel(questions);
          groups.push({id: groupId, questions: questionByLevel});
        }).$promise);
      });

      $q.all(groupPromises).then(function() {
        _.each(groups, function(group) {
          var option = _.find(vm.groupOptions, function(option) {
            return group.id == option.id;
          });

          group.numberQuestion = 1;
          group.level = 'easy';
          group.title = option.title;
        });

        vm.groups = groups;
      });
    }

    function removeQuestion(question) {
      vm.selectedQuestions = _.reject(vm.selectedQuestions, function (o) {
        return o.order == question.order;
      });
      _.each(vm.selectedQuestions, function (q, idx) {
        q.order = idx + 1;
      })
    }

  }
}());
