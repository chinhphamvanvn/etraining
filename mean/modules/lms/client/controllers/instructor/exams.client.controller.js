(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ExamsController', ExamsController);

ExamsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve', 'scheduleResolve','Notification','QuestionsService','ExamsService', 'GroupsService','$q','fileManagerConfig','_'];

function ExamsController($scope, $state, $window, Authentication, $timeout, exam,schedule, Notification, QuestionsService, ExamsService, GroupsService, $q, fileManagerConfig,_) {
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
    vm.questions = [];
    vm.tinymce_options = fileManagerConfig;
    
    vm.groupConfig = {
            create: false,
            maxItems: 1,
            valueField: 'value',
            labelField: 'title',
            searchField: 'title'
        };
        vm.groupOptions = [];
        GroupsService.listQuestionGroup(function(data) {
            vm.groupOptions = _.map(data, function(obj) {
                return {
                    id: obj._id,
                    title: obj.name,
                    value: obj._id
                }
            });
        });
     vm.selectedQuestions = [];
     var selectedIds = _.pluck(vm.exam.questions,'id');
     if (selectedIds.length)
         vm.selectedQuestions = QuestionsService.byIds({questionIds:_.pluck(vm.exam.questions,'id')},function() {
             _.each(vm.selectedQuestions,function(question) {
                 var examQuestion = _.find(vm.exam.questions,function(q) {
                     return q.id == question._id;
                 });
                 question.score = examQuestion.score;
                 question.order = examQuestion.order;
             });
         });
     
     function moveUp(question) {
         var prevQuestion = _.find(vm.selectedQuestions,function(q) {
             return q.order < question.order;
         });
         if (prevQuestion) {
             var order = question.order;
             question.order = prevQuestion.order;
             prevQuestion.order = order;
         }
     }

     function moveDown(question) {
         var nextQuestion = _.find(vm.selectedQuestions,function(q) {
             return q.order > question.order;
         });
         if (nextQuestion) {
             var order = question.order;
             question.order = nextQuestion.order;
             nextQuestion.order = order;
         }
     }


    function update() {
         vm.exam.questions = _.map(vm.selectedQuestions,function(q) {
             return {id:q._id,order:q.order,score:q.score}
         });
        vm.exam.$update( function() {
            Notification.success({ message: '<i class="uk-icon-check"></i> Exam saved successfully!'});
            $state.go('workspace.lms.exams.view',{examId:vm.exam._id,scheduleId:vm.schedule._id})
          },
          function() {
            Notification.success({ message: '<i class="uk-icon-check"></i> Exam saved failed!' });
        });
    }

    function selectQuestions() {
        _.each(vm.questions,function(question) {
            if (question.selected) {
                if (! _.find(vm.selectedQuestions,function(q) {
                    return q._id == question._id;
                })) {
                    question.score = 1;
                    question.order = vm.selectedQuestions.length + 1;
                    vm.selectedQuestions.push(question);
                }                
            }
        })
    }

    function selectQuestionGroup(groups) {
        vm.questions = [];
        _.each(groups,function(group) {
           QuestionsService.byCategory({groupId:group},function(questions) {
               vm.questions = vm.questions.concat(questions);
           })     
        });
    }

    function removeQuestion(question) {
        vm.selectedQuestions = _.reject(vm.selectedQuestions,function(o) {
            return o.order == question.order;
        });
        _.each(vm.selectedQuestions,function(q,idx) {
            q.order = idx + 1;
        })
    }

}
}());
