(function(UIkit) {
    'use strict';

    angular
        .module('conference')
        .filter('allocated', ['_', function(_) {
            return function(items) {
                return _.filter(items, function(item) {
                    return item.allocated;
                });

            };
        }]);

    // Conference controller
    angular
        .module('conference')
        .controller('ConferenceController', ConferenceController);

    ConferenceController.$inject = ['$rootScope', '$scope', '$state', '$window', 'localStorageService', '$timeout', 'classResolve', 'memberResolve', 'Notification', 'conferenceSocket', 'webrtcSocket', 'CourseMembersService', 'ngAudio', '$translate', 'pdfDelegate', 'Upload', '_'];

    function ConferenceController($rootScope, $scope, $state, $window, localStorageService, $timeout, classroom, member, Notification, conferenceSocket, webrtcSocket, CourseMembersService, ngAudio, $translate, pdfDelegate, Upload, _) {
        var vm = this;
        vm.classroom = classroom;
        vm.member = member;
        vm.video = true;
        vm.audio = true;
        vm.handUp = false;
        vm.sound = ngAudio.load("/assets/sounds/ring.mp3");
        vm.showToolbar = true;
        vm.numOfMessages = 0;
        vm.chatMessage = [];
        vm.handUpCount = 0;
        vm.showListVideos = true;
        vm.channelList = [];
        vm.videoSlots = [];
        vm.defaultUrl = '/assets/img/Intro.pdf';
        vm.zoom = 90;
        pdfDelegate
            .$getByHandle('my-pdf-container')
            .load(vm.defaultUrl);
        vm.setPanel = setPanel;
        vm.chat = chat;
        vm.sendChatMessage = sendChatMessage;
        vm.inviteMember = inviteMember;
        vm.hideToolbar = hideToolbar;
        vm.connect = connect;
        vm.disconnect = disconnect;
        vm.toggleAudio = toggleAudio;
        vm.toggleVideo = toggleVideo;
        vm.toggleHand = toggleHand;
        vm.pdfSwitchPage = pdfSwitchPage;
        vm.memberDiscard = memberDiscard;
        vm.zoomOut = zoomOut;
        vm.zoomIn = zoomIn;
        vm.uploadPresentation = uploadPresentation;
        vm.signout = signout;

        vm.teacher = CourseMembersService.get({
            memberId: vm.classroom.teacher
        }, function() {
            vm.students = CourseMembersService.byClass({
                classroomId: vm.classroom._id
            }, function() {
                vm.members = [vm.teacher];
                vm.members = vm.members.concat(vm.students);

                var count = 0;
                _.each(vm.members, function(member, index) {
                    vm.videoSlots.push({
                        id: member._id,
                        allocated: false,
                        videoId: 'remoteCamera' + index,
                        publisher: member
                    });

                });
            });
        });


        conferenceSocket.init(vm.classroom._id);

        function onDisconnected() {
            vm.connected = false;
            vm.selectPanel = '';
            webrtcSocket.unpublish();
            conferenceSocket.unregisterChannel();
            if (vm.member.role === 'student')
                webrtcSocket.unsubscribe(vm.teacher.member._id);
            _.each(vm.videoSlots, function(slot) {
                if (slot.allocated) {
                    webrtcSocket.unsubscribe(slot.publisher.member._id);
                }
                slot.allocated = false;
            });
        }

        function hideToolbar() {
            $timeout(function() {
                vm.showToolbar = false;
            }, 5000);
        }
        function connect() {
            vm.sound.play();
            vm.sound.loop = true;
            vm.connected = false;
            vm.connecting = true;
            conferenceSocket.join();

            vm.sound.stop();
            vm.connected = true;
            vm.connecting = false;
            var localCamera = document.getElementById('localCamera');
            webrtcSocket.publishWebcam(localCamera, function() {
                conferenceSocket.registerChannel();
                if (vm.member.role === 'teacher')
                    conferenceSocket.publishChannel(vm.member.member._id);
            });
        }

        function disconnect() {
            conferenceSocket.leave();
            vm.connected = false;
            vm.selectPanel = '';
            webrtcSocket.unpublish();
            conferenceSocket.unregisterChannel();
            if (vm.member.role === 'student')
                webrtcSocket.unsubscribe(vm.teacher.member._id);
        }

        function toggleAudio() {
            var localStream = webrtcSocket.getPublish().webRtcEndpoint.getLocalStream();
            if (localStream) {
                var audioTrack = localStream.getAudioTracks()[0];
                vm.audio = !vm.audio;
                audioTrack.enabled = vm.audio;
            }

        }
        function toggleVideo() {
            var localStream = webrtcSocket.getPublish().webRtcEndpoint.getLocalStream();
            if (localStream) {
                var videoTrack = localStream.getVideoTracks()[0];
                vm.video = !vm.video;
                videoTrack.enabled = vm.video;
            }
        }
        function toggleHand() {
            vm.handUp = !vm.handUp;
            if (vm.handUp)
                conferenceSocket.handUp();
            else
                conferenceSocket.handDown();
        }

        function signout() {
            conferenceSocket.leave();
            vm.disconnect();
            $window.history.back();
        }

        function setPanel(panel) {
            if (panel === 'slideshow') {
                vm.slideshow = !vm.slideshow;
            }
            if (panel === 'members') {
                vm.msgHandUp = false;
            }

            if (vm.selectPanel === panel) {
                vm.selectPanel = '';
                return;
            }

            vm.selectPanel = panel;
        }
        function inviteMember(member) {
            if (!member.invited && member.online && member.webcam) {
                conferenceSocket.publishChannel(member.member._id);
                member.invited = !member.invited;
            }
            
        }

        function chat() {
            conferenceSocket.chat(vm.chatInput)
            vm.chatInput = "";
        }

        function sendChatMessage($event) {
            if (event.code === 'Enter') {
                vm.chat();
            }
        }

        function pdfSwitchPage(offset) {
            if (offset === 1) {
                pdfDelegate.$getByHandle('my-pdf-container').next();
            } else {
                pdfDelegate.$getByHandle('my-pdf-container').prev();
            }
            getPageInfo();
            if (vm.pdfUrl === vm.defaultUrl || vm.member.role === 'student')
                return;
            conferenceSocket.presentation(vm.pdfUrl, 'switchPage', {
                curPage: vm.currPage
            })
        }

        function memberDiscard(publisher) {
            var member = publisher.member;
            if (member) {
                member.handUp = false;
                member.invited = false;
                conferenceSocket.unpublishChannel(member._id);
            }
            webrtcSocket.unsubscribe(publisher.member._id);
            var subscribedSlots = _.find(vm.videoSlots, function(slot) {
                return slot.publisher._id === publisher._id;
            });
            if (subscribedSlots) {
                subscribedSlots.allocated = false;
            }
        }

        function getPageInfo() {
            vm.currPage = pdfDelegate.$getByHandle('my-pdf-container').getCurrentPage();
            vm.totalPages = pdfDelegate.$getByHandle('my-pdf-container').getPageCount();
        }
        function zoomOut() {
            pdfDelegate.$getByHandle('my-pdf-container').zoomOut();
            vm.zoom = (vm.zoom === 50) ? 50 : (vm.zoom - 10);
        }

        function zoomIn() {
            pdfDelegate.$getByHandle('my-pdf-container').zoomIn();
            vm.zoom += 10;
        }
        function uploadPresentation(file) {
            if (!file || vm.member.role === 'student') {
                return;
            }
            Upload.upload({
                url: '/api/courses/presentation/upload',
                data: {
                    newCoursePresentation: file
                }
            }).then(function(response) {
                var data = angular.fromJson(response.data);
                vm.pdfUrl = data.fileURL;
                pdfDelegate
                    .$getByHandle('my-pdf-container')
                    .load(vm.pdfUrl);
                conferenceSocket.presentation(data.fileURL, 'new', {});
            }, function(errorResponse) {
                console.log(errorResponse);
            });
        }

        conferenceSocket.onChat(function(text, memberId) {
            if (!vm.connected)
                return;
            var chatMember = _.find(vm.members, function(obj) {
                return obj.member._id === memberId;
            });
            vm.chatMessage.push({
                'user': chatMember.member.displayName,
                'text': text,
                'idx': 'message_' + vm.chatMessage.length
            });

            if (vm.member.member._id !== memberId) {
                vm.numOfMessages++;
            }

            var newMsg = angular.element(document.querySelector('#message_' + (vm.chatMessage.length - 1)));
            var chatContent = angular.element(document.querySelector('#chat-content'));
            if (!(_.isEmpty(newMsg))) {
                chatContent.scrollTo(newMsg, 0, 500);
            }
        });


        conferenceSocket.onMemberStatus(function(memberStatusList) {
            if (!vm.connected)
                return;
            vm.handUpCount = _.filter(memberStatusList, function(status) {
                return status.handUp;
            }).length;
            _.each(vm.members, function(member) {
                var status = _.find(memberStatusList, function(obj) {
                    return obj.memberId === member.member._id;
                })
                if (status) {
                    member.online = true;
                    member.handUp = status.handUp;
                    member.webcam = status.webcam;
                    member.invited = status.invited;
                    if (member.invited) {
                        member.handUp = false;
                    }
                } else {
                    member.invited = false;
                    member.online = false;
                    member.handUp = false;
                    member.webcam = false;
                }
            });

        });

        conferenceSocket.onChannelStatus(function(channelList) {
            if (!vm.connected)
                return;
            vm.channelList = channelList;
            var subscribedSlots = _.filter(vm.videoSlots, function(slot) {
                return _.contains(channelList, slot.publisher.member._id);
            });
            var unsubscribedSlots = _.filter(vm.videoSlots, function(slot) {
                return !_.contains(channelList, slot.publisher.member._id);
            });
            _.each(subscribedSlots, function(slot) {
                if (!slot.allocated && slot.publisher.member._id !== vm.member.member._id) {
                    var camera = document.getElementById(slot.videoId)
                    webrtcSocket.subscribe(camera, slot.publisher.member._id, function() {});
                    slot.allocated = true;
                }
            });
            _.each(unsubscribedSlots, function(slot) {
                if (slot.allocated) {
                    webrtcSocket.unsubscribe(slot.publisher.member._id);
                }
                slot.allocated = false;
            });
        });

        if (vm.member.role === 'student') {
            conferenceSocket.onPresentation(function(url, action, params) {
                if (!vm.connected)
                    return;
                if (action === 'new') {
                    if (url !== vm.pdfUrl) {
                        vm.pdfUrl = url;
                        pdfDelegate
                            .$getByHandle('my-pdf-container')
                            .load(vm.pdfUrl);
                    }
                } else if (action === 'switchPage') {
                    if (url !== vm.pdfUrl) {
                        vm.pdfUrl = url;
                        pdfDelegate
                            .$getByHandle('my-pdf-container')
                            .load(vm.pdfUrl);
                    }
                    pdfDelegate.$getByHandle('my-pdf-container').goToPage(params.curPage);
                    getPageInfo();
                }
            });
        }

    }
}(window.UIkit));
