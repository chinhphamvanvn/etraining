(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('conference')
    .directive('teachingBoard', ['conferenceSocket', 'webrtcSocket', 'pdfDelegate', '$timeout', 'Upload', '_', teachingBoard]);

  function teachingBoard(conferenceSocket, webrtcSocket, pdfDelegate, $timeout, Upload, _) {
    return {
      scope: {
        connected: '=',
        teacher: '=',
        students: '=',
        member: '=',
        slideshow: '='
      },
      templateUrl: '/src/client/conference/directives/teaching-board/teaching-board.client.view.html',
      link: function(scope, element, attributes) {
        scope.showListVideos = true;
        scope.members = [scope.teacher];
        scope.members = scope.members.concat(scope.students);
        scope.channelList = [];
        scope.videoSlots = [];
        var count = 0;
        _.each(scope.members, function(member, index) {
          scope.videoSlots.push({
            id: member._id,
            allocated: false,
            videoId: 'remoteCamera' + index,
            publisher: member
          });

        });
        scope.$watch('connected', function() {
          if (!scope.connected) {
            _.each(scope.videoSlots, function(slot) {
              if (slot.allocated) {
                webrtcSocket.unsubscribe(slot.publisher.member._id);
              }
              slot.allocated = false;
            });
          }
        });
        scope.defaultUrl = '/assets/img/Intro.pdf';
        scope.zoom = 90;
        pdfDelegate
          .$getByHandle('my-pdf-container')
          .load(scope.defaultUrl);
        scope.pdfSwitchPage = function(offset) {
          if (offset === 1) {
            pdfDelegate.$getByHandle('my-pdf-container').next();
          } else {
            pdfDelegate.$getByHandle('my-pdf-container').prev();
          }
          getPageInfo();
          if (scope.pdfUrl === scope.defaultUrl || scope.member.role === 'student')
            return;
          conferenceSocket.presentation(scope.pdfUrl, 'switchPage', {
            curPage: scope.currPage
          })
        }

        scope.memberDiscard = function(publisher) {
          var member = publisher.member;
          if (member) {
            member.handUp = false;
            member.invited = false;
            conferenceSocket.unpublishChannel(member._id);
          }
          webrtcSocket.unsubscribe(publisher.member._id);
          var subscribedSlots = _.find(scope.videoSlots, function(slot) {
            return slot.publisher._id === publisher._id;
          });
          if(subscribedSlots){
            subscribedSlots.allocated = false;
          }
        }

        function getPageInfo() {
          scope.currPage = pdfDelegate.$getByHandle('my-pdf-container').getCurrentPage();
          scope.totalPages = pdfDelegate.$getByHandle('my-pdf-container').getPageCount();
        }
        scope.zoomOut = function() {
          pdfDelegate.$getByHandle('my-pdf-container').zoomOut();
          scope.zoom = (scope.zoom === 50) ? 50 : (scope.zoom - 10);
        }

        scope.zoomIn = function() {
          pdfDelegate.$getByHandle('my-pdf-container').zoomIn();
          scope.zoom += 10;
        }
        scope.uploadPresentation = function(file) {
          if (!file || scope.member.role === 'student') {
            return;
          }
          Upload.upload({
            url: '/api/courses/presentation/upload',
            data: {
              newCoursePresentation: file
            }
          }).then(function(response) {
            var data = angular.fromJson(response.data);
            scope.pdfUrl = data.fileURL;
            pdfDelegate
              .$getByHandle('my-pdf-container')
              .load(scope.pdfUrl);
            conferenceSocket.presentation(data.fileURL, 'new', {});
          }, function(errorResponse) {
            console.log(errorResponse);
          });
        }
        conferenceSocket.onChannelStatus(function(channelList) {
          if (!scope.connected)
            return;
          scope.channelList = channelList;
          var subscribedSlots = _.filter(scope.videoSlots, function(slot) {
            return _.contains(channelList, slot.publisher.member._id);
          });
          var unsubscribedSlots = _.filter(scope.videoSlots, function(slot) {
            return !_.contains(channelList, slot.publisher.member._id);
          });
          _.each(subscribedSlots, function(slot) {
            if (!slot.allocated && slot.publisher.member._id !== scope.member.member._id) {
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

        if (scope.member.role === 'student') {
          conferenceSocket.onPresentation(function(url, action, params) {
            if (!scope.connected)
              return;
            if (action === 'new') {
              if (url !== scope.pdfUrl) {
                scope.pdfUrl = url;
                pdfDelegate
                  .$getByHandle('my-pdf-container')
                  .load(scope.pdfUrl);
              }
            } else if (action === 'switchPage') {
              if (url !== scope.pdfUrl) {
                scope.pdfUrl = url;
                pdfDelegate
                  .$getByHandle('my-pdf-container')
                  .load(scope.pdfUrl);
              }
              pdfDelegate.$getByHandle('my-pdf-container').goToPage(params.curPage);
              getPageInfo();
            }
          });
        }
      }
    }
  }
}());
