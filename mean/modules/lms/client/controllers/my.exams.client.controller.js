(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('MyExamsListController', MyExamsListController);

MyExamsListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout','localStorageService', 'Notification','SubmissionsService','$translate','ExamCandidatesService','examUtils', '$q', 'GroupsService','_'];

function MyExamsListController($scope, $state, $window, Authentication, $timeout, localStorageService, Notification, SubmissionsService, $translate, ExamCandidatesService,examUtils,$q ,GroupsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.study = study;
    vm.candidates = ExamCandidatesService.byUser({ userId:localStorageService.get('userId')},function() {
        _.each(vm.candidates,function(candidate) {
            if (candidate.role=='student')
                examUtils.candidateProgress(candidate._id,candidate.exam._id).then(function(progress) {
                    candidate.percentage = progress.percentage;
                    candidate.attemptCount = progress.count;
                });
        });
    });
    
    function study(candidate) {
        if (candidate.schedule.status!='available') {
            UIkit.modal.alert($translate.instant('ERROR.EXAM.NOT_AVAILABLE'));
            return;
        }
        var now = new Date();
        var start = new Date(candidate.schedule.start);
        var end = new Date(candidate.schedule.end);
        if (now.getTime() < start.getTime()) {
            UIkit.modal.alert($translate.instant('ERROR.EXAM.NOT_START_YET'));
            return;
        }
        if (now.getTime() > end.getTime()) {
            UIkit.modal.alert($translate.instant('ERROR.EXAM.ALREADY_FINISH'));
            return;
        }
        $state.go('workspace.lms.exams.study',{candidateId:candidate._id,examId:candidate.exam._id,scheduleId:candidate.schedule._id});
    }
}
    

}());