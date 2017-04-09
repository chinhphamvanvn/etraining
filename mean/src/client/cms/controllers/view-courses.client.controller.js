(function() {
  'use strict';

  // Programs controller
  angular
    .module('cms')
    .controller('ProgramViewController', ProgramViewController);

  ProgramViewController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'programResolve', '_'];

  function ProgramViewController($scope, $state, $window, Authentication, $timeout, program, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.program = program;
  }
}());
