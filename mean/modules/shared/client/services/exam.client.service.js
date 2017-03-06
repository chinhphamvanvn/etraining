(function () {
  'use strict';

  angular
  .module('shared')
    .service('examUtils', ['SubmissionsService','ExamsService','$q','_',
        function (SubmissionsService,ExamsService,$q,_) {
            return {
                candidateProgress: function(candidateId,examId) {
                    return $q(function(resolve, reject) {
                        var exam = ExamsService.get({examId:examId}, function() {
                            var submits = SubmissionsService.byCandidate({candidateId:candidateId},function() {
                                var progress  =  { percentage: Math.floor(submits.length * 100 / exam.maxAttempt),count:submits.length};
                                resolve(progress);
                            });
                        });
                    });                    
                },
                
            };
        }]
    )
}());