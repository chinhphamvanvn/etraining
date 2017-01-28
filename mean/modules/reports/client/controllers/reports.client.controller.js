(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window'];
  
  function ReportsController($scope, $rootScope, $state, Authentication, menuService) {
    var vm = this;
    vm.authentication = Authentication;
   
   
  }
}());
