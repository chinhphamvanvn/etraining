(function () {
  'use strict';
  
    angular.module('lms')
        .directive('videoAutoplay', function() {
        return {
        link: function(scope, element, attrs) {
            scope.$watch(
                function () { return element.attr('data-attr-autoplay'); },
                function (newVal) { 
                    if (scope.$eval(newVal)) {
                        element[0].autoplay = true;
                    }
                    else {
                        element[0].autoplay = false;
                    }
                }
            );
            }
        };
    })
    .directive('videoControl', function() {
        return {
        link: function(scope, element, attrs) {
            scope.$watch(
                function () { return element.attr('data-attr-control'); },
                function (newVal) { 
                    if (scope.$eval(newVal)) {
                        element[0].controls = true;
                    }
                    else {
                        element[0].controls = false;
                    }
                }
            );
            }
        };
    })
    .directive('videoMuted', function() {
        return {
        link: function(scope, element, attrs) {
            scope.$watch(
                function () { return element.attr('data-attr-muted'); },
                function (newVal) { 
                    if (scope.$eval(newVal)) {
                        element[0].muted = true;
                    }
                    else {
                        element[0].muted = false;
                    }
                }
            );
            }
        };
    })
    .directive('videoSelector',[ '$sce', 'Notification', 'Upload','deviceDetector', function($sce,Notification,Upload,deviceDetector) {
        return {
            restrict: 'E',
            templateUrl: '/modules/lms/client/directives/video-selector/video-selector.client.directive.view.html',
            controllerAs: 'ctrl',
            scope: {
                url: '=', 
            },
            link: function(scope, element, attr) {
                var progressbar = $("#file_upload-progressbar"),
                bar         = progressbar.find('.uk-progress-bar'),
                settings    = {

                    action: '/api/courses/video', // upload url
                    param: 'newCourseVideo',
                    method: 'POST',

                    allow : '*.(mp3|mp4|webm|mov|avi|flv|mpeg)', // allow only images

                    loadstart: function() {
                        bar.css("width", "0%").text("0%");
                        progressbar.removeClass("uk-hidden");
                    },

                    progress: function(percent) {
                        percent = Math.ceil(percent);
                        bar.css("width", percent+"%").text(percent+"%");
                    },

                    allcomplete: function(response) {

                        bar.css("width", "100%").text("100%");

                        setTimeout(function(){
                            progressbar.addClass("uk-hidden");
                        }, 250);
                        var data = JSON.parse(response);
                        scope.url = data.videoURL;
                        scope.$apply();
                    }
                };

                var select = UIkit.uploadSelect($("#file_upload-select"), settings),
                drop   = UIkit.uploadDrop($("#file_upload-drop"), settings);
                
                var webRtcPeer = null;
                
                scope.startRecord = function () {
                    if (!scope.recordMode) {
                        scope.recordMode = true;
                        //var localWebcam = $('#selectorVideo');
                        var localWebcam = document.getElementById('selectorVideo');
                        var options = {
                                localVideo: localWebcam
                            };
                        webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
                            if (!error) {
                                scope.videoAttr = {
                                        autoplay:true,
                                        controls:false,
                                        muted:true
                                };
                                scope.url = URL.createObjectURL( webRtcPeer.getLocalStream());
                                recordedBlobs = [];
                                var options = {
                                    mimeType: 'video/webm;codecs=vp9'
                                };
                                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                                    console.log(options.mimeType + ' is not Supported');
                                    options = {
                                        mimeType: 'video/webm;codecs=vp8'
                                    };
                                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                                        console.log(options.mimeType + ' is not Supported');
                                        options = {
                                            mimeType: 'video/webm'
                                        };
                                        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                                            console.log(options.mimeType + ' is not Supported');
                                            options = {
                                                mimeType: ''
                                            };
                                        }
                                    }
                                }
                                try {
                                    mediaRecorder = new MediaRecorder(webRtcPeer.getLocalStream(), options);
                                } catch (e) {
                                    console.error('Exception while creating MediaRecorder: ' + e);
                                    console.error('Exception while creating MediaRecorder: ' + e + '. mimeType: ' + options.mimeType);
                                    return;
                                }
                                console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
                                mediaRecorder.ondataavailable = handleDataAvailable;
                                mediaRecorder.start(10);
                                scope.recordMode = true;
                                scope.videoAttr = {
                                        autoplay:true,
                                        controls:false,
                                        muted:true
                                };
                                scope.$apply();
                            
                            }});  
                    }
                }
            
            var mediaSource = new MediaSource();
            mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
            var mediaRecorder;
            var recordedBlobs;
            var sourceBuffer;            
            
            function handleSourceOpen() {
                sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
            };
           
            function handleDataAvailable(event) {
                if (event.data && event.data.size > 0) {
                    recordedBlobs.push(event.data);
                }
                if (deviceDetector.browser === 'firefox' && !scope.recordMode) {
                    var superBuffer = new Blob(recordedBlobs, {
                        type: 'video/webm'
                    });
                    var file = new File([superBuffer],  new Date().getTime()+"upload.webm",{type: "video/webm"});
                    onDataAvail(file);
                }
            };
            
            function handleError(error) {
                Notification.error({ message: '<i class="uk-icon-ban"></i> Record video errorerror!' +error });
            };
                
            scope.stopRecord = function () {
                try {
                    mediaRecorder.stop();
                } catch (e) {
                    console.error('Exception while closing MediaRecorder: ' + e);
                }
                scope.recordMode = false;
                scope.videoAttr = {
                        autoplay:true,
                        controls:false,
                        muted:true
                };
                if (deviceDetector.browser === 'chrome') {
                    var superBuffer = new Blob(recordedBlobs, {
                        type: 'video/webm'
                    });
                    var file = new File([superBuffer], new Date().getTime()+"upload.webm" , {type: "video/webm"});
                    onDataAvail(file);
                    
                }
                if (webRtcPeer)
                    webRtcPeer.dispose();
            }
           
            scope.$on('$destroy', function() {
                if (webRtcPeer)
                    webRtcPeer.dispose();
            });
            
            function onDataAvail(file) {
                Upload.upload({
                    url: '/api/courses/video',
                    data: {
                        newCourseVideo: file,
                        'Content-Type': 'webm'
                    }
                  }).then(function(response) {
                      scope.url = response.data.videoURL;
                      scope.$apply();
                  },function(errorResponse) {
                      Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Video uploaded error!' });
                  });    
            }

        }
        }}]);
}());