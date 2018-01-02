(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('examResult', ['SubmissionsService', 'examUtils', '_', examResult]);

  function examResult(SubmissionsService, examUtils, _) {
    return {
      scope: {
        exam: '=',
        candidate: '='
      },
      templateUrl: '/src/client/lms/directives/exam-result/exam.result.client.view.html',
      link: function(scope, element, attributes) {
        scope.submits = SubmissionsService.byExamAndCandidate({
          examId: scope.exam._id,
          candidateId: scope.candidate._id
        }, function() {
          _.each(scope.submits, function(submit) {
            var start = new Date(submit.start);
            var end = new Date(submit.end);
            submit.duration = Math.floor((end.getTime() - start.getTime()) / 1000);
            examUtils.candidateScoreBySubmit(scope.candidate, scope.exam, submit)
              .then(function(score) {
                submit.score = score;
              });
          });
        });
      }
    };
  }
}());
