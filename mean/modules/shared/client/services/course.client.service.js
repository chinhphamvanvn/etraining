(function () {
  'use strict';

  angular
  .module('shared')
    .service('courseUtils', ['EditionSectionsService','AttemptsService','$q','_',
        function (EditionSectionsService,AttemptsService,$q,_) {
            return {
                memberProgress: function(memberId,editionId) {
                    return $q(function(resolve, reject) {
                        var sections = EditionSectionsService.byEdition({editionId:editionId}, function() {
                            var attempts = AttemptsService.byMember({memberId:memberId},function() {
                                var total =0;
                                var complete = 0;
                                _.each(sections,function(section) {
                                    if (section.hasContent) {
                                        var read = _.find(attempts,function(attempt) {
                                            return attempt.section == section._id && attempt.status=='completed';
                                        });
                                        total++;
                                        if (read)
                                            complete++;
                                    }
                                });
                                resolve(Math.floor(complete * 100 / total));
                            });
                        });
                    });                    
                },
                
                
            };
        }]
    )
}());