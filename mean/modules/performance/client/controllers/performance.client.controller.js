(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PerformanceController', PerformanceController);

  PerformanceController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window'];
  
  function PerformanceController($scope, $rootScope, $state, Authentication, menuService) {
    var vm = this;
    vm.authentication = Authentication;
   
   
  }
}());
