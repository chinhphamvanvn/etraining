(function () {
    'use strict';

    angular
      .module('lms')
      .controller('CoursesJoinController', CoursesJoinController);

    CoursesJoinController.$inject = [ '$scope', '$rootScope','$state', '$stateParams', 'Authentication', '$location', '$window', 'GroupsService', 'Notification', 'treeUtils', '_'];

    function CoursesJoinController( $scope,$rootScope, $state, $stateParams, Authentication, $location, $window, GroupsService, Notification, treeUtils, _) {
      var vm = this;
      vm.user = Authentication.user;
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

    }
  }());

