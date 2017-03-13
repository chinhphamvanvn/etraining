(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ExamsScoreboardController', ExamsScoreboardController);

ExamsScoreboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve','scheduleResolve','userResolve','Notification', 'ExamCandidatesService', 'CompetencyAchievementsService','ExamsService','examUtils', '_', 'SubmissionsService'];

function ExamsScoreboardController($scope, $state, $window, Authentication, $timeout, exam, schedule,user, Notification, ExamCandidatesService,CompetencyAchievementsService, ExamsService ,examUtils, _, SubmissionsService) {
    var vm = this;
    vm.user = user;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.authorize = authorize;
    
    vm.candidates = ExamCandidatesService.byExam({examId:vm.exam._id},function() {
        vm.candidates = _.filter(vm.candidates,function(obj) {
            return obj.role=='student';
        });
        _.each(vm.candidates,function(candidate) {
            if (vm.schedule.competency)
                CompetencyAchievementsService.byUserAndCompetency({achiever:candidate.candidate._id,competencyId:vm.schedule.competency},function(achievement) {
                    candidate.achievement =  achievement;
                    console.log(achievement);
                },function() {
                    candidate.achievement = null;
                });
            examUtils.candidateScore(candidate._id,vm.exam._id).then(function(score) {
                candidate.score = score;
            });
            candidate.submits = {};
            candidate.submits = SubmissionsService.byExamAndCandidate({examId:vm.exam._id,candidateId:candidate._id},function() {
                _.each(candidate.submits,function(submit) {
                    examUtils.candidateScoreByBusmit(candidate._id,vm.exam._id,submit._id).then(function(score) {
                        submit.score = score;
                        console.log(submit.score);
                    });
                });
            });
            examUtils.candidateProgress(candidate._id,vm.exam._id).then(function(progress) {
                candidate.attemptCount = progress.count;
            });
        });
    } );
    
    function authorize(candidate) {
        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
        var achievement = new CompetencyAchievementsService();
        achievement.achiever = candidate.candidate._id;
        achievement.competency = vm.schedule.competency;
        achievement.source = 'exam';
        achievement.issueBy = new Date();
        achievement.granter = vm.user._id;
        achievement.$save(function() {
            candidate.achievement = achievement;
            modal.hide();
        });
    }
}
}());