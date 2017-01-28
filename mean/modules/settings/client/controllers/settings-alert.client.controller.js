(function () {
  'use strict';

  angular
    .module('settings')
    .controller('AlertSettingsController', AlertSettingsController);

  AlertSettingsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window'];
  
  function AlertSettingsController($scope, $rootScope, $state, Authentication, menuService) {
    var vm = this;
    vm.authentication = Authentication;
   
   
  }
}());
