(function() {
  'use strict';

  angular
    .module('shared')
    .service('programUtils', ['CourseProgramsService', 'ProgramMembersService', 'CourseMembersService', '$q', '_',
      function(CourseProgramsService, ProgramMembersService, CourseMembersService, $q, _) {
        return {
          memberProgress: function(memberId, programId) {
            return $q(function(resolve, reject) {
              var member = ProgramMembersService.get({
                programmemberId: memberId
              }, function() {
                var program = CourseProgramsService.get({
                  programId: programId
                }, function() {
                  var allPromises = [];
                  _.each(program.courses, function(course) {
                    allPromises.push(CourseMembersService.byUserAndCourse({
                      userId: member.member,
                      courseId: course
                    }).$promise);
                  });
                  $q.all(allPromises).then(function(courseMembers) {
                    var completeCount = _.filter(courseMembers, function(courseMember) {
                      return courseMember.enrollmentStatus === 'completed';
                    }).length;
                    if (program.courses.length) {
                      resolve({
                        completeCount: completeCount,
                        completePercentage: completeCount * 100 / program.courses.length
                      });
                    } else
                      resolve({
                        completeCount: 0,
                        completePercentage: 0
                      });
                  });
                });
              });
            });
          }
        };
      }]
  );
}());
