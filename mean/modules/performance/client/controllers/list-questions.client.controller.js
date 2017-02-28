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
    
    function selectGroup(groups) {
        vm.groups = groups;
        vm.questions  = [];
        _.each(vm.groups,function(group) {
            QuestionsService.byCategory({groupId:group},function(questions) {
                vm.questions = vm.questions.concat(questions); 
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
                vm.question.$remove(function() {
                    vm.question = _.reject(vm.question ,function(question) {
                        return question._id == question._id;
                    })
                });
            });
    }
   
  }
}());
