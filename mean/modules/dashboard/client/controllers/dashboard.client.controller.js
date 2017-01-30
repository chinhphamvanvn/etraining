(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$interval', '$window'];
  
  function DashboardController($scope, $rootScope, $state, Authentication, menuService, $timeout, $interval, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
    
    vm.dynamicStats = [
       {
           id: '1',
           title: 'Visitors (last 7d)',
           count: '0',
           chart_data: [ 5,3,9,6,5,9,7 ],
           chart_options: {
               height: 28,
               width: 48,
               fill: ["#d84315"],
               padding: 0.2
           }
       },
       {
           id: '2',
           title: 'Sale',
           count: '0',
           chart_data: [ 5,3,9,6,5,9,7,3,5,2 ],
           chart_options: {
               height: 28,
               width: 64,
               fill: "#d1e4f6",
               stroke: "#0288d1"
           }
       },
       {
           id: '3',
           title: 'Orders Completed',
           count: '0',
           chart_data: [ '64/100' ],
           chart_options: {
               height: 24,
               width: 24,
               fill: ["#8bc34a", "#eee"]
           }
       },
       {
           id: '4',
           title: 'Visitors (live)',
           count: '1',
           chart_data: [ 5,3,9,6,5,9,7,3,5,2,5,3,9,6,5,9,7,3,5,2 ],
           chart_options: {
               height: 28,
               width: 64,
               fill: "#efebe9",
               stroke: "#5d4037"
               }
           }
       ];

   // countUp update
   $scope.$on('onLastRepeat', function (scope, element, attrs) {
       vm.dynamicStats[0].count = '1245678';
       vm.dynamicStats[1].count = '142384';
       vm.dynamicStats[2].count = '64';

       // update live statistics
       function getRandomVal(min, max) {
           return Math.floor(Math.random() * (max - min + 1)) + min;
       }

       $interval(function () {
           var random = Math.round(Math.random() * 10);
           var live_values = vm.dynamicStats[3].chart_data.toString().split(",");

           live_values.shift();
           live_values.push(random);
           live_values.join(",");

           var countTo = getRandomVal(20, 100);

           vm.dynamicStats[3].chart_data = live_values;
           vm.dynamicStats[3].count = (vm.dynamicStats[3].count == countTo) ? countTo : getRandomVal(20, 120);

       }, 2000)
   });

   
  }
}());
