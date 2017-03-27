(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ProgramProgressController', ProgramProgressController);

ProgramProgressController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'programResolve','programMemberResolve','Notification','_'];

function ProgramProgressController($scope, $state, $window, Authentication, $timeout, program, member,  Notification, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.member = member;
    vm.program = program;
    
}
}());