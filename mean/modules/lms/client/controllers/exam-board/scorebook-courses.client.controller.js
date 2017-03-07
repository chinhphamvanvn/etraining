(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ExamsScorebookController', ExamsScorebookController);

ExamsScorebookController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve','scheduleResolve','candidateResolve', 'Notification','AnswersService', 'OptionsService', 'QuestionsService', 'ExamsService','SubmissionsService', 'AttemptsService','treeUtils','$translate','examUtils', '_'];

function ExamsScorebookController($scope, $state, $window, Authentication, $timeout, exam, schedule, candidate, Notification,AnswersService, OptionsService, QuestionsService, ExamsService, SubmissionsService,AttemptsService ,treeUtils, $translate, examUtils,_) {
    var vm = this;
    vm.authentication = Authentication;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.candidate = candidate;

    
    
}
}());