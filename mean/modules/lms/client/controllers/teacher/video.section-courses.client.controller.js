(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesVideoSectionController', CoursesVideoSectionController);

CoursesVideoSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve', 'videoResolve','Notification', 'EditionSectionsService','fileManagerConfig', '$translate','$q','_'];

function CoursesVideoSectionController($scope, $state, $window, Authentication, $timeout, course, section, video, Notification, EditionSectionsService ,fileManagerConfig,$translate, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.section = section;
    vm.video = video;
    vm.update = update;
    vm.tinymce_options = fileManagerConfig;
    vm.selectVideo = selectVideo;
    
    function saveSection() {
        return $q(function(resolve, reject) {
            vm.section.html=null;
            vm.section.video = vm.video._id;
            vm.section.$update(function() {
                resolve();
            },function() {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section HTML updated error!' });
                reject();
            })
        });
    }
    
    function saveVideo() {
        return $q(function(resolve, reject) {
            vm.video.$update(function () {
                resolve();
            },function() {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section HTML updated error!' });
                reject();
            });
        });
    }
    
    function update() {
        saveVideo()
        .then(saveSection)
        .then(function() {
            $state.go('workspace.lms.courses.section.view.video',{courseId:vm.course._id,sectionId:vm.section._id});
        });
    }
    
    vm.videos = [
                 {
                     source: $translate.instant('COMMON.VIDEO_SOURCE.ORIGINAL'),
                     videoURL: vm.video.videoURL,
                     selected: true
                  },
                  {
                      source: $translate.instant('COMMON.VIDEO_SOURCE.UPLOAD'),
                      videoURL: null,
                      selected: false
                   },
                   {
                       source: $translate.instant('COMMON.VIDEO_SOURCE.RECORD'),
                       videoURL: null,
                       selected: false
                    }
                 ]

    function selectVideo(video) {
        if (video.selected)
            vm.video.videoURL = video.videoURL;
        else
            vm.video.videoURL = null;
    }
}
}());