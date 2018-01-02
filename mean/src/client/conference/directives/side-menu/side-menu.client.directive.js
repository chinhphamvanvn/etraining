(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('conference')
    .directive('sideMenu', ['ngAudio', 'conferenceSocket', '$location', '_', sideMenu]);

  function sideMenu(ngAudio, conferenceSocket, $location, _) {
    return {
      scope: {
        connected: '=',
        selectPanel: '=',
        member: '=',
        students: '=',
        teacher: '=',
        slideshow: '='
      },
      templateUrl: '/src/client/conference/directives/side-menu/side-menu.client.view.html',
      link: function(scope, element, attributes) {
        scope.numOfMessages = 0;
        scope.chatMessage = [];
        scope.handUpCount = 0;
        scope.members = [scope.teacher];
        scope.members = scope.members.concat(scope.students);
        scope.setPanel = function(panel) {
          if(panel === 'slideshow'){
            scope.slideshow = !scope.slideshow;
          }
          if (panel === 'members') {
            scope.msgHandUp = false;
          }

          if (scope.selectPanel === panel) {
            scope.selectPanel = '';
            return;
          }

          scope.selectPanel = panel;
        }
        scope.inviteMember = function(member) {
          if (!member.invited && member.online && member.webcam) {
            conferenceSocket.publishChannel(member.member._id);
          }
          member.invited = !member.invited;
        }

        scope.chat = function() {
          conferenceSocket.chat(scope.chatInput)
          scope.chatInput = "";
        }

        scope.sendChatMessage = function($event) {
          if (event.code === 'Enter') {
            scope.chat();
          }
        }

        conferenceSocket.onChat(function(text, memberId) {
          if (!scope.connected)
            return;
          var chatMember = _.find(scope.members, function(obj) {
            return obj.member._id === memberId;
          });
          scope.chatMessage.push({
            'user': chatMember.member.displayName,
            'text': text,
            'idx': 'message_' + scope.chatMessage.length
          });

          if (scope.member.member._id !== memberId) {
            scope.numOfMessages++;
          }

          var newMsg = angular.element(document.querySelector('#message_' + (scope.chatMessage.length - 1)));
          var chatContent = angular.element(document.querySelector('#chat-content'));
          if (!(_.isEmpty(newMsg))) {
            chatContent.scrollTo(newMsg, 0, 500);
          }
        });


        conferenceSocket.onMemberStatus(function(memberStatusList) {
          if (!scope.connected)
            return;
          scope.handUpCount = _.filter(memberStatusList, function(status) {
            return status.handUp;
          }).length;
          _.each(scope.members, function(member) {
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
            }
            else {
              member.invited = false;
              member.online = false;
              member.handUp = false;
              member.webcam = false;
            }
          });
        });
      }
    }
  }
}());
