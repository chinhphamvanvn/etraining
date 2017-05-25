'use strict';
var Room = require('./conference/room.js');
var Member = require('./conference/member.js');
var CHANNEL_ID = 'conference';
var _ = require('lodash');
var rooms = {};

function join(io, socket, roomId) {
  try {
    var room = rooms[roomId];
    if (!room) {
      console.log('Create new room', roomId)
      room = new Room(roomId);
    }
    var member = new Member(socket.request.user._id);
    room.addMember(member);
    rooms[roomId] = room;
    _.remove(room.channelList, function(channel) {
      return channel == socket.request.user._id;
    });
    socket.join(roomId, function() {
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
        id: 'broadcastMember',
        memberList: room.getMemberList()
      }));
      if (room.presentation) {
        socket.emit(CHANNEL_ID, JSON.stringify({
          id: 'broadcastPresentation',
          url: room.presentation.url,
          action: room.presentation.action,
          params: room.presentation.params
        }));
      }
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
        id: 'broadcastChannel',
        channelList: room.channelList
      }));
    });
  } catch (exc) {
    console.log('Join exception', exc)
  }
}

function leave(io, socket, roomId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    var member = room.getMember(socket.request.user._id);
    room.removeMember(member);
    _.remove(room.channelList, function(channel) {
      return channel === socket.request.user._id;
    });
    socket.leave(roomId, function() {
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
        id: 'broadcastMember',
        memberList: room.getMemberList()
      }));
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
        id: 'broadcastChannel',
        channelList: room.channelList
      }));
    });
  } catch (exc) {
    console.log('Leave exception', exc)
  }

}

function publishChannel(io, socket, roomId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    if (room.channelList.indexOf(socket.request.user._id) == -1)
      room.channelList.push(socket.request.user._id);
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastChannel',
      channelList: room.channelList
    }));
  } catch (exc) {
    console.log('Publish webcam exception', exc)
  }

}

function unpublishChannel(io, socket, roomId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    _.remove(room.channelList, function(channel) {
      return channel === socket.request.user._id;
    });
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastChannel',
      channelList: room.channelList
    }));
  } catch (exc) {
    console.log('Unpublish webcam exception', exc)
  }

}

function handUp(io, socket, roomId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    var member = room.getMember(socket.request.user._id);
    member.handUp = true;
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastMember',
      memberList: room.getMemberList()
    }));
  } catch (exc) {
    console.log('Hand up exception', exc)
  }

}

function handDown(io, socket, roomId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    var member = room.getMember(socket.request.user._id);
    member.handUp = false;
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastMember',
      memberList: room.getMemberList()
    }));
  } catch (exc) {
    console.log('Hand down exception', exc)
  }

}

function chat(io, socket, roomId, text) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    var member = room.getMember(socket.request.user._id);
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastChat',
      text: text,
      memberId: socket.request.user._id
    }));
  } catch (exc) {
    console.log('Chat exception', exc)
  }

}

function presentation(io, socket, roomId, url, action, params) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    // save the last action
    room.presentation = {
      url: url,
      action: action,
      params: params
    };
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastPresentation',
      url: url,
      action: action,
      params: params
    }));
  } catch (exc) {
    console.log('Presentation exception', exc)
  }

}

function invite(io, socket, roomId, memberId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    var member = room.getMember(memberId);
    member.invited = true;
    member.handUp = false;
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastMember',
      memberList: room.getMemberList()
    }));
  } catch (exc) {
    console.log('Invite exception', exc)
  }

}

function discard(io, socket, roomId, memberId) {
  try {
    var room = rooms[roomId];
    if (!room)
      return;
    var member = room.getMember(memberId);
    member.invited = false;
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
      id: 'broadcastMember',
      memberList: room.getMemberList()
    }));
  } catch (exc) {
    console.log('Discard exception', exc)
  }

}

module.exports = function(io, socket) {

  socket.on(CHANNEL_ID, function(message) {
    console.log(CHANNEL_ID, ' receive: ', message);

    switch (message.id) {
      case 'join':
        join(io, socket, message.roomId);
        break;
      case 'leave':
        leave(io, socket, message.roomId);
        break;
      case 'publishChannel':
        publishChannel(io, socket, message.roomId);
        break;
      case 'unpublishChannel':
        unpublishChannel(io, socket, message.roomId);
        break;
      case 'handUp':
        handUp(io, socket, message.roomId);
        break;
      case 'handDown':
        handDown(io, socket, message.roomId);
        break;
      case 'invite':
        invite(io, socket, message.roomId, message.memberId);
        break;
      case 'discard':
        discard(io, socket, message.roomId, message.memberId);
        break;
      case 'chat':
        chat(io, socket, message.roomId, message.text);
        break;
      case 'presentation':
        presentation(io, socket, message.roomId, message.url, message.action, message.params);
        break;
      default:
        console.log('Error to parse');
        break;
    }
  });

};
