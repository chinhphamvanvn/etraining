(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('programProgressBook', ['CourseProgramsService', 'CoursesService', 'CourseMembersService', 'ProgramMembersService', 'courseUtils', '_', programProgressBook]);

  function programProgressBook(CourseProgramsService, CoursesService, CourseMembersService, ProgramMembersService, courseUtils, _) {
    return {
      scope: {
        program: '=',
        member: '='
      },
      templateUrl: '/src/client/lms/directives/program-progress-book/program-progress-book.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.courses = [];
        _.each(scope.program.courses, function(courseId) {
          courseId = (typeof courseId === 'string') ? courseId : courseId._id;
          CoursesService.get({
            courseId: courseId
          }, function(course) {
            scope.courses.push(course);
            course.percentage = 0;
            course.member = CourseMembersService.byUserAndCourse({
              userId: scope.member.member._id,
              courseId: course._id
            }, function() {
              courseUtils.memberProgress(course.member._id, course.member.edition).then(function(progress) {
                course.percentage = progress;
              });
            });
          });
        });
      }
    };
  }
}());
