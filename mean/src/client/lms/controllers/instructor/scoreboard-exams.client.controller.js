(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ExamsScoreboardController', ExamsScoreboardController);

  ExamsScoreboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'candidateResolve', 'examResolve', 'scheduleResolve', 'userResolve', 'Notification', 'ExamCandidatesService', 'CompetencyAchievementsService', 'ExamsService', 'examUtils', '_', 'SubmissionsService', '$translate'];

  function ExamsScoreboardController($scope, $state, $window, Authentication, $timeout, candidate, exam, schedule, user, Notification, ExamCandidatesService, CompetencyAchievementsService, ExamsService, examUtils, _, SubmissionsService, $translate) {
    var vm = this;
    vm.user = user;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.scoreboardListCsv = [];
    vm.headerArrCsv = [$translate.instant('MODEL.USER.DISPLAY_NAME'), $translate.instant('MODEL.CANDIDATE.REGISTER_DATE'), $translate.instant('MODEL.CANDIDATE.STATUS'), $translate.instant('MODEL.CANDIDATE.SCORE'), $translate.instant('MODEL.CANDIDATE.NUMBER'), $translate.instant('MODEL.CANDIDATE.RESULT')];
    vm.candidate = candidate;
    vm.certifyCompetency = certifyCompetency;

    vm.candidates = ExamCandidatesService.byExam({
      examId: vm.exam._id
    }, function() {
      vm.candidates = _.filter(vm.candidates, function(obj) {
        return obj.role === 'student';
      });
      _.each(vm.candidates, function(candidate) {
        if (vm.schedule.competency) {
          CompetencyAchievementsService.byUserAndCompetency({
            achiever: candidate.candidate._id,
            competencyId: vm.schedule.competency
          }, function(achievement) {
            candidate.achievement = achievement;
            console.log(achievement);
          }, function() {
            candidate.achievement = null;
          });
        }
        examUtils.candidateScore(candidate, vm.exam).then(function(score) {
          var resultScore;
          candidate.score = score;
          examUtils.candidateProgress(candidate, vm.exam).then(function(progress) {
            candidate.attemptCount = progress.count;
            candidate.submits = {};
            candidate.labelSubmit = '';
            var inumber = 0;
            candidate.submits = SubmissionsService.byExamAndCandidate({
              examId: vm.exam._id,
              candidateId: candidate._id
            }, function() {
              if (candidate.submits.length === 0) {
                var itemCandidate0 = [candidate.candidate.displayName, candidate.registered.slice(0, 10), candidate.status, candidate.labelSubmit, candidate.attemptCount + '/' + vm.exam.maxAttempt, $translate.instant('COMMON.FAIL')];
                vm.scoreboardListCsv.push(itemCandidate0);
              }
              _.each(candidate.submits, function(submit) {
                examUtils.candidateScoreByBusmit(candidate, vm.exam, submit).then(function(score) {
                  inumber++;
                  submit.score = score;
                  candidate.labelSubmit = candidate.labelSubmit + submit.score + '% ';
                  if (inumber === candidate.submits.length) {
                    if (candidate.score >= vm.exam.benchmark) {
                      resultScore = $translate.instant('COMMON.PASS');
                    } else {
                      resultScore = $translate.instant('COMMON.FAIL');
                    }
                    var itemCandidate = [candidate.candidate.displayName, candidate.registered.slice(0, 10), candidate.status, candidate.labelSubmit, candidate.attemptCount + '/' + vm.exam.maxAttempt, resultScore];
                    vm.scoreboardListCsv.push(itemCandidate);
                  }
                });
              });
            });
          });
        });
      });
    });

    function certifyCompetency(candidate) {
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      vm.candidate.$certify({
        studentId: candidate._id
      }, function() {
        candidate.achievement = true;
        modal.hide();
      });
    }
  }
}(window.UIkit));
