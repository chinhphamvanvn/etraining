(function () {
    'use strict';

    angular
      .module('lms')
      .controller('CoursesJoinController', CoursesJoinController);

    CoursesJoinController.$inject = [ '$scope', '$rootScope','$state', '$stateParams', 'UsersService', 'courseResolve', '$window', 'GroupsService', 'Notification', 'CourseMembersService','localStorageService', '_'];

    function CoursesJoinController( $scope,$rootScope, $state, $stateParams, UsersService, course, $window, GroupsService, Notification, CourseMembersService,localStorageService, _) {
      var vm = this;
      vm.page = 'intro';
      vm.course = course;
      vm.gotoWorkspace = gotoWorkspace;
      $rootScope.toBarActive = true;
      $rootScope.topMenuActive = true;
      
      function gotoWorkspace() {
          if (_.contains(vm.user.roles,'admin'))
              $state.go('admin.workspace.dashboard');
          else
              $state.go('workspace.lms.courses.me');
      }

      $scope.$on('$destroy', function() {
          $rootScope.toBarActive = false;
          $rootScope.topMenuActive = false;
      });
      vm.member = CourseMembersService.meByCourse({courseId:vm.course._id,userId:localStorageService.get('userId')},function(data) {
      },function() {
          vm.member =null;
      });
      
      

    }
  }());

