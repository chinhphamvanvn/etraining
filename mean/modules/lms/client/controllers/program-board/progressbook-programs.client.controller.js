(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('ProgramsProgressbookController', ProgramsProgressbookController);

ProgramsProgressbookController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'programResolve','programMemberResolve','gradeResolve', 'Notification','_'];

function ProgramsProgressbookController($scope, $state, $window, Authentication, $timeout, program, member, gradescheme, Notification, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.member = member;
    vm.program = program;
    
}
}());