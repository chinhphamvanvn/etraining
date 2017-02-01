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
    vm.remove = remove;
    vm.update = update;
    vm.tinymce_options = fileManagerConfig;
    
    function update() {
        vm.section.$update(function () {
            Notification.success({ message: '<i class="uk-icon-ok"></i> Section created successfully!' });
            $state.go('workspace.lms.courses.section.view',{courseId:vm.course._id,sectionId:vm.section._id});
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
         });
    }
    
    function remove() {
        vm.section.$remove(function (response) {
            $state.go('workspace.lms.courses.outline',{courseId:vm.course._id});
            }, function (errorResponse) {
              Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section removed error!' });
          });
    }
}
}());