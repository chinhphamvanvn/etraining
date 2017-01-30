(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesOutlineSectionController', CoursesOutlineSectionController);

CoursesOutlineSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'Notification', 'EditionSectionsService', 'fileManagerConfig','_'];

function CoursesOutlineSectionController($scope, $state, $window, Authentication, $timeout, course, section, Notification, EditionSectionsService ,fileManagerConfig, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.section = section;

}
}());