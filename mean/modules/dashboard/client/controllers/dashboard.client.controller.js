(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window'];
  
  function DashboardController($scope, $rootScope, $state, Authentication, menuService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
   
  }
}());
