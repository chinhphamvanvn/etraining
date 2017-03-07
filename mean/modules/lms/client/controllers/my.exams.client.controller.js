(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('MyExamsListController', MyExamsListController);

MyExamsListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout','localStorageService', 'Notification','SubmissionsService','SchedulesService','ExamCandidatesService','examUtils', '$q', 'GroupsService','_'];

function MyExamsListController($scope, $state, $window, Authentication, $timeout, localStorageService, Notification, SubmissionsService, SchedulesService, ExamCandidatesService,examUtils,$q ,GroupsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.candidates = ExamCandidatesService.byUser({ userId:localStorageService.get('userId')},function() {
        _.each(vm.candidates,function(candidate) {
            if (candidate.role=='student')
                examUtils.candidateProgress(candidate._id,candidate.exam._id).then(function(progress) {
                    candidate.exam.percentage = progress.percentage;
                    candidate.exam.attemptCount = progress.attemptCount;
                });
        });
    });
}
    

}());