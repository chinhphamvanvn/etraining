(function () {
  'use strict';

  angular
    .module('settings')
    .controller('SystemSettingsController', SystemSettingsController);

  SystemSettingsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'SettingsService', '$timeout', '$window'];
  
  function SystemSettingsController($scope, $rootScope, $state, Authentication, SettingsService,$timeout,$window) {
    var vm = this;
    vm.settings = SettingsService.query(function() {
        console.log(vm.settings);
    });
   
   
  }
}());
