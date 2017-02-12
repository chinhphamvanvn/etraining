(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesHTMLSectionController', CoursesHTMLSectionController);

CoursesHTMLSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve','htmlResolve', 'Notification', 'EditionSectionsService', 'fileManagerConfig','$q', '_'];

function CoursesHTMLSectionController($scope, $state, $window, Authentication, $timeout, course, section, html,Notification, EditionSectionsService ,fileManagerConfig, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.section = section;
    vm.html = html;
    vm.save = save;
    vm.tinymce_options = fileManagerConfig;
    
    function saveSection() {
        return $q(function(resolve, reject) {
            vm.section.html = vm.html._id;
            vm.section.$update(function() {
                resolve();
            },function() {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section HTML updated error!' });
                reject();
            })
        });
    }
    
    function saveHtml() {
        return $q(function(resolve, reject) {
            vm.html.$update(function () {
                resolve();
            },function() {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section HTML updated error!' });
                reject();
            });
        });
    }
    
    function save() {
        saveHtml()
        .then(saveSection)
        .then(function() {
            $state.go('workspace.lms.courses.section.view.html',{courseId:vm.course._id,sectionId:vm.section._id});
        });
    }
}
}());