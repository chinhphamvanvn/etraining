(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ExamsScorebookController', ExamsScorebookController);

ExamsScorebookController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve','scheduleResolve','candidateResolve', 'Notification','AnswersService', 'OptionsService', 'QuestionsService', 'ExamsService','SubmissionsService', 'AttemptsService','treeUtils','$translate', '_'];

function ExamsScorebookController($scope, $state, $window, Authentication, $timeout, exam, schedule, candidate, Notification,AnswersService, OptionsService, QuestionsService, ExamsService, SubmissionsService,AttemptsService ,treeUtils, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.candidate = candidate;
    vm.submits = SubmissionsService.byExamAndCandidate({examId:vm.exam._id,candidateId:vm.candidate._id},function() {
        _.each(vm.submits,function(submit) {
            var start = new Date(submit.start);
            var end = new Date(submit.end);
            submit.duration = Math.floor((end.getTime() - start.getTime())/1000);
        });
    })
    
    
}
}());