(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ExamsScoreboardCandidateController', ExamsScoreboardCandidateController);

  ExamsScoreboardCandidateController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve', 'scheduleResolve', 'candidateResolve', 'Notification', 'ExamCandidatesService', 'CompetencyAchievementsService', 'ExamsService', 'examUtils', '_'];

  function ExamsScoreboardCandidateController($scope, $state, $window, Authentication, $timeout, exam, schedule, candidate, Notification, ExamCandidatesService, CompetencyAchievementsService, ExamsService, examUtils, _) {
    var vm = this;
    vm.exam = exam;
    vm.schedule = schedule;
    vm.candidate = candidate;
  }
}());
