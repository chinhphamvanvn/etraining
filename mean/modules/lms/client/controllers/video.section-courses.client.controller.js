(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesVideoSectionController', CoursesVideoSectionController);

CoursesVideoSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'videoResolve','Notification', 'EditionSectionsService', 'fileManagerConfig','_'];

function CoursesVideoSectionController($scope, $state, $window, Authentication, $timeout, course, section, video, Notification, EditionSectionsService ,fileManagerConfig, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.section = section;
    vm.video = video;
    vm.update = update;
    vm.mode = 'review';
    
    function update() {
        vm.section.$update(function () {
            Notification.success({ message: '<i class="uk-icon-ok"></i> Section created successfully!' });
            $state.go('workspace.lms.courses.section.view',{courseId:vm.course._id,sectionId:vm.section._id});
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
         });
    }
    
    vm.video_data = [
             {
                 id: '-CYs99M7hzA',
                 name: 'Unboxing the HERO4',
                 source: 'Mashable'
             },
             {
                 id: 'te689fEo2pY',
                 name: 'Apple Watch Unboxing & Setup',
                 source: 'Unbox Therapy'
             },
             {
                 id: '7AFJeaYojhU',
                 name: 'Energous WattUp Power Transmitter',
                 source: 'TechCrunch'
             },
             {
                 id: 'hajnEpCq5SE',
                 name: 'The new MacBook - Design',
                 source: 'Apple'
             }
         ];

     var $video_player = $('#video_player'),
         $video_playlist = $('#video_player_playlist'),
         active_class = 'md-list-item-active';

      
}
}());