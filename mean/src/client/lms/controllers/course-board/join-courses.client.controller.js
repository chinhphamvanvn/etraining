(function() {
  'use strict';

  angular
    .module('lms')
    .controller('CoursesJoinController', CoursesJoinController);

  CoursesJoinController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', 'UsersService', 'courseResolve', 'editionResolve', '$window', 'GroupsService', 'Notification', 'CourseEditionsService', 'CourseMembersService', 'localStorageService', '_'];

  function CoursesJoinController($scope, $rootScope, $state, $stateParams, Authentication, UsersService, course, edition, $window, GroupsService, Notification, CourseEditionsService, CourseMembersService, localStorageService, _) {
    var vm = this;
    vm.user = Authentication.user;
    vm.course = course;
    vm.edition = edition;

    $rootScope.toBarActive = true;
    $rootScope.topMenuActive = true;

    $scope.$on('$destroy', function() {
      $rootScope.toBarActive = false;
      $rootScope.topMenuActive = false;
    });
    vm.member = CourseMembersService.byUserAndCourse({
      courseId: vm.course._id,
      userId: localStorageService.get('userId')
    }, function(data) {}, function() {
      vm.member = null;
    });
  }
}());
