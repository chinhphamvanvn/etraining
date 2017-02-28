(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesOutlineController', CoursesOutlineController);

CoursesOutlineController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve', 'Notification', 'CourseEditionsService', 'EditionSectionsService','treeUtils','_'];

function CoursesOutlineController($scope, $state, $window, Authentication, $timeout, edition, course, Notification, CourseEditionsService,EditionSectionsService , treeUtils, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.course = course;
    vm.outline_mode='edit';
    vm.changeOutlineMode = changeOutlineMode;
    
    function changeOutlineMode() {
        if (vm.outline_mode=='edit')
            $state.go('workspace.lms.courses.outline.edit',({courseId:vm.course._id,editionId:vm.edition._id}));
        if (vm.outline_mode=='preview')
            $state.go('workspace.lms.courses.outline.preview',({courseId:vm.course._id,editionId:vm.edition._id}));
    }
}
}());