(function() {
  'use strict';

  // Create the Socket.io wrapper service
  angular
    .module('core')
    .factory('conferenceSocket', conferenceSocket);

  conferenceSocket.$inject = ['localStorageService', '$state', '$timeout', 'Socket'];

  function conferenceSocket(localStorageService, $state, $timeout, Socket) {
    var memberCallback,
      channelCallback,
      chatCallback,
      presentationCallback,
      roomId,
      memberId;

    var CHANNEL_ID = 'conference';

    // Wrap the Socket.io 'emit' method
    function send(data) {
      if (Socket) {
        Socket.emit(CHANNEL_ID, data);
      }
    }

    // Wrap the Socket.io 'on' method
    function on(callback) {
      if (Socket) {
        Socket.on(CHANNEL_ID, function(data) {
          $timeout(function() {
            callback(data);
          });
        });
      }
    }

    // Wrap the Socket.io 'removeListener' method
    function removeListener() {
      if (Socket) {
        Socket.removeListener(CHANNEL_ID);
      }
    }

    Socket.on(CHANNEL_ID, function(data) {
      var parsedMessage = JSON.parse(data);
      console.info('Received message: ' + data);
      switch (parsedMessage.id) {
        case 'broadcastMember':
          if (memberCallback)
            memberCallback(parsedMessage.memberList);
          break;
        case 'broadcastChannel':
          if (channelCallback)
            channelCallback(parsedMessage.channelList);
          break;
        case 'broadcastChat':
          if (chatCallback)
            chatCallback(parsedMessage.text, parsedMessage.memberId);
          break;
        case 'broadcastPresentation':
          if (presentationCallback)
            presentationCallback(parsedMessage.url, parsedMessage.action, parsedMessage.params);
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    });

    return {
      init: function(rId) {
        roomId = rId;
      },
      join: function() {
        send({
          id: 'join',
          roomId: roomId
        });
      },
      leave: function() {
        send({
          id: 'leave',
          roomId: roomId
        });
      },
      publishChannel: function() {
        send({
          id: 'publishChannel',
          roomId: roomId
        });
      },
      unpublishChannel: function() {
        send({
          id: 'unpublishChannel',
          roomId: roomId
        });
      },
      onMemberStatus: function(callback) {
        memberCallback = callback
      },
      onChannelStatus: function(callback) {
        channelCallback = callback
      },
      onChat: function(callback) {
        chatCallback = callback
      },
      onPresentation: function(callback) {
        presentationCallback = callback
      },
      handUp: function() {
        send({
          id: 'handUp',
          roomId: roomId
        });
      },
      handDown: function() {
        send({
          id: 'handDown',
          roomId: roomId
        });
      },
      invite: function(memberId) {
        send({
          id: 'invite',
          roomId: roomId,
          memberId: memberId
        });
      },
      discard: function(memberId) {
        send({
          id: 'discard',
          roomId: roomId,
          memberId: memberId
        });
      },
      chat: function(text) {
        send({
          id: 'chat',
          roomId: roomId,
          text: text
        });
      },
      presentation: function(url, action, params) {
        send({
          id: 'presentation',
          roomId: roomId,
          url: url,
          action: action,
          params: params
        });
      }
    }
  }
}());
