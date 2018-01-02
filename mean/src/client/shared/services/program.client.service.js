(function() {
  'use strict';

  angular
    .module('shared')
    .service('programUtils', ['CourseProgramsService', 'ProgramMembersService', 'CourseMembersService', '$q', '_',
      function(CourseProgramsService, ProgramMembersService, CourseMembersService, $q, _) {
        return {
          memberProgress: function(member, program) {
            return $q(function(resolve, reject) {
              var allPromises = [];
              var courseCount = 0;
              var completeCount = 0;
              _.each(program.courses, function(course) {
                CourseMembersService.byUserAndCourse({
                  userId: member.member._id,
                  courseId: course._id
                }, function(courseMember) {
                  if (courseMember.enrollmentStatus === 'completed')
                    completeCount++;
                  courseCount++;
                  if (courseCount === program.courses.length)
                    resolve({
                      completeCount: completeCount,
                      completePercentage: completeCount * 100 / program.courses.length
                    });
                }, function() {
                  courseCount++;
                  if (courseCount === program.courses.length)
                    resolve({
                      completeCount: completeCount,
                      completePercentage: completeCount * 100 / program.courses.length
                    });
                });
              });
            });
          }
        };
      }]
  );
}());
