(function () {
  'use strict';

  angular
    .module('assessment')
    .controller('AssessmentController', AssessmentController);

  AssessmentController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window'];
  
  function AssessmentController($scope, $rootScope, $state, Authentication, menuService) {
    var vm = this;
    vm.authentication = Authentication;
   
   
  }
}());
