(function () {
  'use strict';

  angular
    .module('settings')
    .controller('SystemSettingsController', SystemSettingsController);

  SystemSettingsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window'];
  
  function SystemSettingsController($scope, $rootScope, $state, Authentication, menuService) {
    var vm = this;
    vm.authentication = Authentication;
   
   
  }
}());
