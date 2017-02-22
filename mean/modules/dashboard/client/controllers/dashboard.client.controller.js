(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'ReportsService', '$timeout', '$interval', '$window'];
  
  function DashboardController($scope, $rootScope, $state, Authentication, ReportsService, $timeout, $interval, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = vm.authentication.user;

   vm.userRegisterCount = '0';
   vm.accountUserCount = '0';
   vm.accountAdminCount = '0';
   vm.userBanCount = '0';
   
   ReportsService.accountStats(function(stats) {
       vm.userRegisterCount = stats.total +'';
       vm.accountUserCount = stats.userAccount +'';
       vm.accountAdminCount = stats.adminAccount +'';
       vm.userBanCount = stats.banAccount +'';
   });
   

   
  }
}());
