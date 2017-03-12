(function () {
  'use strict';

  angular
    .module('performance')
    .controller('QuestionsBankController', QuestionsBankController);

  QuestionsBankController.$inject = ['$scope', '$rootScope','$state', 'Authentication','GroupsService','QuestionsService', '$timeout', '$window', 'treeUtils','$translate', '_'];

  function QuestionsBankController($scope, $rootScope, $state, Authentication, GroupsService, QuestionsService, $timeout, $window, treeUtils,$translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.finishEditQuestionTree = finishEditQuestionTree;
    vm.createQuestion = createQuestion;
    vm.remove = remove;
    vm.selectGroup = selectGroup;
    vm.currPage = 1;
    vm.itemsPerPage = 10;

    function selectGroup(groups) {
      console.log('select groups');
        vm.groups = groups;
        vm.currPage = 1;
        vm.questions = [];
        vm.totalQuestions  = [];
        _.each(vm.groups,function(group) {
            QuestionsService.byCategory({groupId:group},function(questions) {
                vm.totalQuestions = vm.totalQuestions.concat(questions);
                vm.questions = vm.totalQuestions.slice(0, vm.itemsPerPage);
            })
        })
    }

    function finishEditQuestionTree() {
        $window.location.reload();
    }


    function createQuestion(type) {
        if (!vm.groups) {
            UIkit.modal.alert($translate.instant('ERROR.QUESTION.EMPTY_QUESTION_GROUP'));
            return;
        }
        var question =  new QuestionsService();
        question.category = vm.groups[0];
        question.type = type;
        question.$save(function() {
            $state.go('admin.workspace.performance.question.edit',{questionId:question._id})
        });


    }

    function remove(question) {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
                question.$remove(function() {
                    vm.totalQuestions = _.reject(vm.totalQuestions ,function(q) {
                        return q._id == question._id;
                    })
                });
            });
    }

  }
}());
