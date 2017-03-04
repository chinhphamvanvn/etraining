(function() {
    'use strict';

// Courses controller
angular
    .module('performance')
    .controller('SchedulesViewController', SchedulesViewController);

SchedulesViewController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'scheduleResolve', 'CoursesService', 'Notification', 'GroupsService', 'Upload', '$q','_'];

function SchedulesViewController($scope, $state, $window, Authentication, $timeout, schedule, CoursesService, Notification, GroupsService,Upload ,$q, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.schedule = schedule;


}
}());