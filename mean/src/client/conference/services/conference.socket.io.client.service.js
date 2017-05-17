(function() {
  'use strict';

  // Create the Socket.io wrapper service
  angular
    .module('core')
    .factory('conferenceSocket', conferenceSocket);

  conferenceSocket.$inject = ['Authentication', '$state', '$timeout', 'Socket'];

  function conferenceSocket(Authentication, $state, $timeout, Socket) {
    var memberCallback, roomId, memberId;
    
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
          watchChannelCallback(parsedMessage.channelList);
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
        send({id: 'join',roomId: roomId});
      },
      leave: function() {
        send({id: 'leave', roomId: roomId});
      },
      onMemberList:function(callback) {
        memberCallback = callback
      },
      onChannelList:function(callback) {
        memberCallback = callback
      },
      handUp: function() {
        send({id: 'handUp', roomId: roomId});
      },
      handDown: function() {
        send({id: 'handDown', roomId: roomId});
      },
      invite: function(memberId) {
        send({id: 'invite', roomId: roomId, memberId: memberId});
      },
      discard: function(memberId) {
        send({id: 'discard', roomId: roomId, memberId: memberId});
      }
    }
  }
}());
