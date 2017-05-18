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
        teacher: '='
      },
      templateUrl: '/src/client/conference/directives/side-menu/side-menu.client.view.html',
      link: function(scope, element, attributes) {
        scope.numOfMessages = 0;
        scope.chatMessage = [];
        scope.handUpCount = 0;
        scope.members = [scope.teacher];
        scope.members = scope.members.concat(scope.students);
        scope.setPanel = function(panel) {
          if (panel === 'members') {
            scope.msgHandUp = false;
          }

          if (scope.selectPanel === panel) {
            scope.selectPanel = '';
            return;
          }

          scope.selectPanel = panel;
        }
        scope.memberInvite = function(member) {
          member.handUp = false;
          member.invited = true;
          if (member.online) {
            conferenceSocket.invite(member.member._id);
          }
        }

        /*   scope.chat = function() {
             var message = {
                 id: 'chat',
                 text: scope.chatInput
             }
             sendMessage(message);
             $scope.chatInput = "";
         }
         
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

         scope.sendChatMessage = function($event) {
             if (event.code === 'Enter') {
                 scope.chat();
             }
         }*/
        conferenceSocket.onMemberList(function(memberStatusList) {
          scope.handUpCount = _.filter(memberStatusList, function(status) {
            return status.handUp;
          }).length;
          _.each(scope.members, function(member) {
            var status = _.find(memberStatusList, function(obj) {
              return obj.memberId == member.member._id;
            })
            if (status)
              member.online = true;
            else
              member.online = false;
          });
        });
      }
    }
  }
}());
