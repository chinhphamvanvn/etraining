(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('conference')
    .controller('ConferenceController', ConferenceController);

  ConferenceController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'classResolve', 'memberResolve', 'Notification', 'conferenceSocket', 'Upload', 'CourseMembersService', '$translate', '_'];

  function ConferenceController($scope, $state, $window, Authentication, $timeout, classroom, member, Notification, conferenceSocket, Upload, CourseMembersService, $translate, _) {
    var vm = this;
    
    vm.authentication = Authentication;
    vm.classroom = classroom;
    vm.member = member;
    vm.onConnecting = onConnecting;
    vm.onConnected = onConnected;
    vm.onDisconnected = onDisconnected;
    vm.teacher= CourseMembersService.get({memberId: vm.classroom.teacher});
    vm.students = CourseMembersService.byClass({
      classroomId: vm.classroom._id
    });
    
    conferenceSocket.init(vm.classroom._id);


    function onConnected() {
      vm.connected = true;
      vm.connecting = false;
    }
    
    function onDisconnected() {
      vm.connected = false;
    }
    
    function onConnecting() {
      vm.connected = false;
      vm.connecting = true;
    }
  }
}(window.UIkit));




/*'use strict';
angular.module('trainingModule').controller('TrainingRoomController', function($scope, $rootScope, $location, $routeParams,
    _, localStorageService, $log, $interval, $sce, $trainingSocket,$one2one, $window, $document, deviceDetector, iceServers, $recorder,
    $mdSidenav, $mdDialog, $translate, $base64, $timeout, ngAudio, toastr, $route, pdfDelegate,$meeting) {
    var channelList = [];
    
    function init() {

        $scope.toolbar = true;
        $scope.navPresent = true;
        $scope.selectTab = 'present';
        $scope.selectPanel = false;
        $scope.showListVideos = true;
        $scope.connecting = false;
        $scope.connected = false;
        $scope.numOfMessages = 0;
        $scope.numOfAllocated = 0;
        $scope.audio = true;
        $scope.video = true;
        $scope.handUp = true;
        $scope.msgHandUp = false;
        $scope.sound = ngAudio.load("assets/sounds/ring.mp3");
        $scope.fullScreen = false;
        $scope.pdfUrl = 'assets/images/Intro.pdf';
        $scope.zoom = 90;        
        $scope.meeting = localStorageService.get("meeting");
        $scope.myProfile = localStorageService.get("member");
        $scope.memberList = localStorageService.get("memberList");        
        $scope.videoSlots = [];
        $scope.chatMessage = [];
        $scope.fileList = [];
        var count = 0;
        _.each($scope.memberList,function(member) {
            member.online = false;
            $scope.videoSlots.push({
                id: member._id,
                name: member.name,
                allocated: false,
                videoId: 'remoteCamera' + count,
                index: count,
                channel: null,
                subscription:null
            });
            count++;
        });   
        $scope.me = _.find($scope.memberList, function(m) {
            return $scope.myProfile._id == m._id;
        });
        $scope.presenter = _.find($scope.memberList, function(m) {
            return m.role == 'presenter';
        });
        $scope.viewerList = _.filter($scope.memberList, function(m) {
            return m.role != 'presenter';
        });
        $scope.bitrate = $scope.qualityOptions[0].bitrate;         
    };

    $scope.setPanel = function(panel) {
        if (panel === 'members') {
            $scope.msgHandUp = false;
        }

        if ($scope.selectPanel === panel) {
            $scope.selectPanel = '';
            return;
        }

        $scope.selectPanel = panel;
    }

    $scope.isSelectPanel = function(panel) {
        return $scope.selectPanel === panel;
    }

    $scope.collapsePanel = function() {
        if ($scope.selectPanel !== '') {
            $scope.selectPanel = '';
        }        
    }

    function autoHideToolbar(type) {
        $timeout(function() {
            if (type === 'control') {
                $scope.toolbar = false;
            } else {
                $scope.navPresent = false;
            }            
        }, 5000);
    }
    
    $scope.showToolbar = function(type) {
        if (type === 'control') {
            $scope.toolbar = true;
        } else {
            $scope.navPresent = true;
        }        
    }

    $scope.hideToolbar = function(type) {
        autoHideToolbar(type);
    }
    
    $scope.disconnect = function() {
        $scope.onCall = false;
        $scope.me.online = false;
        $scope.sound.stop();
        $one2one.hangUp();
        try {
            _.each($scope.viewerList,function(viewer) {
                viewer.invited = false;
                viewer.handUp = false;
            });
            _.each(channelList,function(channel) {
                $one2one.unpublish(channel);
            });
            _.each($scope.videoSlots ,function(slot) {
                if (slot.subscription)
                    unsubscribe(slot.subscription);
                slot.subscription = null;
                slot.channel = null;
                slot.allocated = false;
            });
            sendMessage({ id: 'leave'});
            channelList = [];            
        } catch (e) {
            $log.error(e);
        }
    }

    $scope.signout = function() {
        $scope.disconnect();

        sendMessage({
            id: 'leave'
        });

        localStorageService.clearAll();
        $location.path('/');
    }
    
    $trainingSocket.onmessage = function(message) {
        if (!$scope.onCall)
            return;
        var parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);
        switch (parsedMessage.id) {
            case 'joinResponse':                
                joinResponse(parsedMessage);
                break;
            case 'end':             
                endConference();
                break;
            case 'memberStatus':
                updateMemberList(parsedMessage.onlineList);
                break;
            case 'handUp':
                handUp(parsedMessage);
                break;
            case 'handDown':
                handDown(parsedMessage);
                break;
            case 'broadcastChannel':
                processSubscription(parsedMessage.channelList);
                break;
            case 'chat':
                receiveChat(parsedMessage);
                break;
            case 'presentation':
                onPresentationEvent(parsedMessage.event,parsedMessage.object);
                break;
            case 'fileShare':
                onFileShareEvent(parsedMessage.event,parsedMessage.object);
                break;
            default:
                console.error('Unrecognized message', parsedMessage);
            }
        $scope.$apply();
    };
        
    function sendMessage(message) {
        $scope.numOfMessages = 0;
        message.memberId = $scope.me._id;
        message.meetingId = $scope.meeting._id;
        var jsonMessage = JSON.stringify(message);
        $log.info('Senging training message: ' + jsonMessage);
        try {
            $trainingSocket.send(jsonMessage);
        } catch (exc) {
            $log.info('Error sending message: ',message );
            $window.location.reload();
        }
    };
 
    function joinResponse(message) {
        var localCamera  = document.getElementById('localCamera');
        if (message.response == 'accepted') {
            $one2one.publishWebcam(localCamera, $scope.me._id, $scope.bitrate, function(success,channel) {
                if (!success) 
                    $scope.disconnect();
                else {
                    channelList.push(channel);
                    sendMessage({id:'registerChannel',channel:{id:channel.id,publisherId:channel.publisherId,source:channel.source}});
                    processSubscription(message.channelList);
                    $scope.connected = true;

                    $timeout(function() {
                        $scope.connecting = false;
                        autoHideToolbar('control');
                    }, 7000); 
                }
                $scope.sound.stop();
            });
            processPresentation(message.presentation);
            processFileShare(message.fileShare);
            
        } else {
            $location.path('/');
        }
    };

    $scope.resubscribe = function(subscription) {
        var slot = _.find($scope.videoSlots,function(s) {
            return s.subscription && s.subscription.id == subscription.id; 
         });
        if (slot.subscription) {
            unsubscribe(slot.subscription);
            subscribe(subscription.channel);
        }
    }

    function unsubscribe(subscription) {
        var slot = _.find($scope.videoSlots,function(s) {
           return s.subscription && s.subscription.id == subscription.id; 
        });

        if (slot) {            
            $one2one.unsubscribe(subscription);
            if (subscription.channel.publisherId!= $scope.presenter.id) {              
                slot.allocated = false;
                $scope.numOfAllocated--;
                slot.subscription = null;
                slot.channel = null;
            }            
        }
    }

    function subscribe(channel) {        
        var slot = null;
        if (channel.publisherId == $scope.presenter._id && channel.source=='webcam')
            slot = $scope.videoSlots[0];
         else {
            slot = _.find($scope.videoSlots, function(s) {
                return !s.allocated  && s.index > 0 && s.id == channel.publisherId;
            });
        }
        if (!slot) return;
        var remoteCamera = document.getElementById(slot.videoId);
        $one2one.subscribe(remoteCamera, channel, $scope.me._id,$scope.bitrate, function(success,subscription) {
            if (success) {
                console.log(subscription);
                slot.subscription = subscription;
                slot.member = _.find($scope.memberList,function(member) {
                    return member._id == channel.publisherId;
                });
            }
        });
        slot.allocated = true;
        $scope.numOfAllocated++;
        slot.channel = channel;
    }
    
    function processSubscription(broadcastChannel) {
        _.each($scope.videoSlots,function(slot) {
            if (slot.subscription ) {
                var channel = _.find(broadcastChannel,function(ch) {
                    return slot.subscription.channel.id == ch.id;
                });
                if (!channel)
                    unsubscribe(slot.subscription);
            } 
        });
        _.each(broadcastChannel,function(channel) {
            var member = _.find($scope.memberList,function(m) {
                return m._id == channel.publisherId;
             });

            if (channel.source=='screen') {
                subscribeScreen(channel);
            } else {
                var slot = _.find($scope.videoSlots,function(s) {
                    return (s.subscription || s.allocated) && s.channel.id == channel.id;
                });
                if (!slot) {
                    subscribe(channel);
                    member.invited = true;
                }
            }
        });
    }

    function updateMemberList(onlineList) {
        _.each($scope.memberList, function(curVal) {
            var found = _.find(onlineList, function(m) {
                return curVal._id == m._id;
            });
            curVal.online = found!=null;
        });        
    }

    $scope.toggleListVideos = function() {
        $scope.showListVideos = !$scope.showListVideos;
    }
    
    $scope.toggleHand = function() {
        $scope.handUp = !$scope.handUp;

        if (!$scope.handUp) {
            sendMessage({id: 'handUp'});
        } else {
            sendMessage({id: 'handDown'});
        }
    };
    $scope.toggleSidenav = function(eleId) {
        $mdSidenav(eleId).toggle();
    };
    $scope.changeSizeSlide = function() {
        $scope.fullScreen = !$scope.fullScreen;
    }
    $scope.memberInvite = function(memberId) {
        var member = _.find($scope.memberList, function(m) {
            return m._id == memberId;
        });
        member.handUp = false;
        member.invited = true;
        if ( member.online) {
            sendMessage({
                id: 'invite',
                'inviteeId': member._id
            });
        }
    }
    $scope.memberDiscard = function(slot) {
        var member = slot.member;
        if (member) {
            member.handUp = false;
            member.invited = false;
            sendMessage({
                id: 'discard',
                'inviteeId': member._id
            });
        }
        if (slot.subscription)
            unsubscribe(slot.subscription);
        slot.subscription = null;
        slot.channel = null;
        slot.allocated = false;
    }
    function handUp(message) {
        var member = _.find($scope.memberList, function(m) {
            return m._id == message.memberId;
        });
        member.handUp = true;
        $scope.msgHandUp = true;
    }
    function handDown(message) {
        var member = _.find($scope.memberList, function(m) {
            return m._id == message.memberId;
        });
        member.handUp = false;
        $scope.msgHandUp = false;
    }
    $scope.chat = function() {
        var message = {
            id: 'chat',
            text: $scope.chatInput
        }
        sendMessage(message);
        $scope.chatInput = "";
    }

    $scope.sendChatMessage = function($event) {
        if (event.code === 'Enter') {
            $scope.chat();
        }
    };

    function receiveChat(message) {
        var idx = $scope.chatMessage.length; 

        message.idx = 'message_' + idx;
        $scope.chatMessage.push({
            'user': message.user,
            'text': message.text,
            'idx': message.idx
        });

        if (message.user !== $scope.myProfile.name) {
            $scope.numOfMessages++;
        }
        
        var newMsg = angular.element(document.querySelector('#message_' + (idx - 1)));
        var chatContent = angular.element(document.querySelector('#chat-content'));
        if (!(_.isEmpty(newMsg))) {
            chatContent.scrollTo(newMsg, 0, 500);
        }                    
    }

    $scope.byIndex = function(slot) {
        return slot.index > 0;
    };


    init();
    
    // Presentation event
    function processPresentation(presentation) {
        var lastIndexInsert = _.findLastIndex(presentation, {
            event:'insertSlide'
        });
        var presentationLast = [];
        if(lastIndexInsert !== null && presentation) {
            presentationLast = presentation.slice(lastIndexInsert);
            _.each(presentationLast,function(msg){
                onPresentationEvent(msg.event, msg.object);
                getPageInfo();
            });
        }                
    }

    function onPresentationEvent(event,object) {
        if (event=='insertSlide') {
            pdfDelegate
                    .$getByHandle('my-pdf-container')
                    .load(object);
        }
        if (event=='switchPage') {
            pdfDelegate.$getByHandle('my-pdf-container').goToPage(object.currPage);
        }
        getPageInfo();
    }

    function getPageInfo() {
        $scope.currPage = pdfDelegate.$getByHandle('my-pdf-container').getCurrentPage();
        $scope.totalPages = pdfDelegate.$getByHandle('my-pdf-container').getPageCount();
    }

    $scope.pdfSwitchPage = function(offset) {
        var info = {
            currPage: 0,
            totalPages: pdfDelegate.$getByHandle('my-pdf-container').getPageCount()
        };       
        if (offset == 1) {
            pdfDelegate.$getByHandle('my-pdf-container').next();
        } else {
            pdfDelegate.$getByHandle('my-pdf-container').prev();
        }        
        getPageInfo();
        info.currPage = pdfDelegate.$getByHandle('my-pdf-container').getCurrentPage();
        sendMessage({id:'presentation',event:'switchPage',object:info});
    }

    $scope.zoomOut = function() {
        pdfDelegate.$getByHandle('my-pdf-container').zoomOut();
        $scope.zoom = ($scope.zoom === 50) ? 50 : ($scope.zoom - 10);
    }

    $scope.zoomIn = function() {
        pdfDelegate.$getByHandle('my-pdf-container').zoomIn();
        $scope.zoom += 10;
    }

    $scope.uploadPresentation = function (file) {
        if (!file) {
            return;
        }
        $meeting.uploadPresentation({file:file},function(result) {
            if (result.status && result.data.status) {
                console.log('url', result.data.url);
                 $scope.pdfUrl = result.data.url;
                 $scope.$apply();
                 pdfDelegate
                    .$getByHandle('my-pdf-container')
                    .load(result.data.url);
                sendMessage({id:'presentation',event:'insertSlide',object:result.data.url});
            }
        })
    };
    
   
    
});*/
