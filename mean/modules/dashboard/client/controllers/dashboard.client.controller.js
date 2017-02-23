(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'ReportsService', '$timeout', '$interval', '$window', '$translate','_'];
  
  function DashboardController($scope, $rootScope, $state, Authentication, ReportsService, $timeout, $interval, $window, $translate, _) {
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
   
   vm.userStatsDayOptions = _.map([7,15,30],function(obj) {
       return {title: obj + ' ' + $translate.instant('COMMON.DAY'), value: obj}
   })

     vm.userStatsDayConfig = {
         create: false,
         maxItems: 1,
         placeholder: $translate.instant('PAGE.DASHBOARD.COURSE_STATS.SELECT_DAY'),
         valueField: 'value',
         labelField: 'title',
         create: false,

     };
   

   
  }
}());
