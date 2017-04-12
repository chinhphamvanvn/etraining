(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('MyCoursesListController', MyCoursesListController);

  MyCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'localStorageService', 'CoursesService', 'Notification', 'AttemptsService', 'EditionSectionsService', 'CourseEditionsService', 'CourseMembersService', 'courseUtils', '$q', 'GroupsService', '_'];

  function MyCoursesListController($scope, $state, $window, Authentication, $timeout, localStorageService, CoursesService, Notification, AttemptsService, EditionSectionsService, CourseEditionsService, CourseMembersService, courseUtils, $q, GroupsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.members = CourseMembersService.byUser({
      userId: localStorageService.get('userId')
    }, function() {
      _.each(vm.members, function(member) {
        if (member.enrollmentStatus === 'registered')
          member.course.percentage = 0;
        if (member.enrollmentStatus === 'completed')
          member.course.percentage = 100;

        CourseEditionsService.byCourse({
          courseId: member.course._id
        }, function(edition) {
          member.edition = edition;
          if (member.enrollmentStatus === 'in-study') {
            courseUtils.memberProgress(member, edition).then(function(percentage) {
              member.course.percentage = percentage;
            });
          }
        });

        if (member.course.group)
          member.course.group = GroupsService.get({
            groupId: member.course.group
          });
        var allPromise = [];
        _.each(member.course.prequisites, function(courseId) {
          allPromise.push(CoursesService.get({
            courseId: courseId
          }).$promise);
        });
        $q.all(allPromise).then(function(prequisites) {
          member.course.prequisites = prequisites;
        });
      });
    });
    vm.unenroll = unenroll;

    function unenroll(member) {
      member.$withdraw(function(response) {
        Notification.success({
          message: '<i class="uk-icon-ok"></i> Member withdrawn successfully!'
        });
        $window.location.reload();
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Member withdraw  error!'
        });
      });
    }
  }
}());
