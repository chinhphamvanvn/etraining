(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesHTMLSectionController', CoursesHTMLSectionController);

CoursesHTMLSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve','editionResolve', 'htmlResolve', 'Notification', 'EditionSectionsService', 'fileManagerConfig','$q', '_','$translate'];

function CoursesHTMLSectionController($scope, $state, $window, Authentication, $timeout, course, section,edition, html,Notification, EditionSectionsService ,fileManagerConfig, $q, _,$translate) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.edition = edition;
    vm.section = section;
    vm.html = html;
    vm.save = save;
    vm.tinymce_options = fileManagerConfig;
    
    function saveSection() {
        return $q(function(resolve, reject) {
            var name = vm.section.name.trim();
                if (!name) {
                    UIkit.modal.alert($translate.instant('ERROR.GROUP.EMPTY_NAME_NOT_ALLOW'));
                    return;
                } else{
                vm.section.html = vm.html._id;
                vm.section.$update(function() {
                    resolve();
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section HTML updated error!' });
                    reject();
                })
            }
        });
    }
    
    function saveHtml() {
        return $q(function(resolve, reject) {
            vm.html.$update(function () {
                resolve();
            },function(errorResponse) {
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