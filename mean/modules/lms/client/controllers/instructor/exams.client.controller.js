(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ExamsController', ExamsController);

ExamsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve', 'scheduleResolve','Notification','QuestionsService','ExamsService', 'GroupsService','$q','_'];

function ExamsController($scope, $state, $window, Authentication, $timeout, exam,schedule, Notification, QuestionsService, ExamsService, GroupsService, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.addQuestion = addQuestion;
    vm.removeQuestion = removeQuestion;
    vm.moveUp = moveUp;
    vm.moveDown = moveDown;
    vm.update = update;
    vm.questions = [];
    
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

    _.each(vm.exam.questions,function(q) {
        var question = QuestionsService.get({questionId:q.id},function() {
            question.order = q.order;
            vm.questions.push(question);
        });
    });

   

    function update() {


    }

    function selectQuestionGroup(groups) {
        vm.questions = [];
        _.each(groups,function(group) {
           QuestionsService.byGroup({groupId:group},function(questions) {
               vm.questions = vm.questions.concat(questions);
           })     
        });
    }

    function removeQuestion(question) {
        vm.selectedQuestions = _.reject(vm.selectedQuestions,function(o) {
            return o.order == question.order && !o._id;
    }

}
}());
