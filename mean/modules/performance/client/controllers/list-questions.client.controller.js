(function () {
  'use strict';

  angular
    .module('performance')
    .controller('QuestionsBankController', QuestionsBankController);

  QuestionsBankController.$inject = ['$scope', '$rootScope','$state', 'Authentication','GroupsService','QuestionsService', '$timeout', '$window', 'treeUtils', '_'];
  
  function QuestionsBankController($scope, $rootScope, $state, Authentication, GroupsService, QuestionsService, $timeout, $window, treeUtils, _) {
    var vm = this;
    vm.authentication = Authentication;
   
    vm.createQuestion = createQuestion;
    vm.remove = remove;
 
    vm.groups = GroupsService.listQuestionGroup( function() {
        var tree = treeUtils.buildGroupTree(vm.groups);
        $timeout(function() {
            $("#questionTree").fancytree({
                checkbox: true,
                titlesTabbable: true,
                selectMode:2,
                clickFolderMode:3,
                imagePath: "/assets/icons/others/",
                extensions: ["wide", "childcounter"],
                autoScroll: true,
                generateIds: true,
                source: tree,
                toggleEffect: { effect: "blind", options: {direction: "vertical", scale: "box"}, duration: 200 },
                childcounter: {
                  deep: true,
                  hideZeros: true,
                  hideExpanded: true
                },
                loadChildren: function(event, data) {
                    data.node.updateCounters();
                },
                select: function(event, data) {
                    vm.selectedGroup =  data.node.data;
                    vm.questions = QuestionsService.byCategory({groupId:vm.selectedGroup._id},function() {
                    })
                },
               
            });
        });
   }); 


    
    function createQuestion(type) {
        if (!vm.selectedGroup) {
            UIkit.modal.alert('Please select a group!');
            return;
        }
        var question =  new QuestionsService();
        question.category = vm.selectedGroup._id;
        question.type = type;
        question.$save(function() {
            $state.go('admin.workspace.performance.question.edit',{questionId:question._id})
        });
        
         
    }
    
    function remove(question) {
            UIkit.modal.confirm('Are you sure?', function() {
                vm.question.$remove(function() {
                    vm.question = _.reject(vm.question ,function(question) {
                        return question._id == question._id;
                    })
                });
            });
    }
   
  }
}());
