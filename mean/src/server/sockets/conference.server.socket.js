'use strict';
var Room = require('./conference/room.js');
var Member = require('./conference/member.js');
var CHANNEL_ID = 'conference';
var _ = require('lodash');
var rooms = {};
var nextId = 0;

function join(io, socket, roomId, sessionId) {
    try {
        var room = rooms[roomId];
        if (!room) {
            console.log('Create new room', roomId)
            room = new Room(roomId);
        }
        var member = new Member(socket.request.user._id, sessionId);
        room.addMember(member);
        rooms[roomId] = room;
        _.remove(room.channelList, function(channel) {
            return channel === socket.request.user._id;
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
        console.log('Join exception', exc. roomId, room.getMemberList())
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
        console.log('Leave exception', exc, roomId, room.getMemberList())
    }

}

function registerChannel(io, socket, roomId) {
  try {
      var room = rooms[roomId];
      if (!room)
          return;
      var member = room.getMember(socket.request.user._id);
      member.webcam = true;
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
          id: 'broadcastMember',
          memberList: room.getMemberList()
      }));
  } catch (exc) {
      console.log('Register webcam exception', exc, roomId, room.getMemberList())
  }

}

function unregisterChannel(io, socket, roomId) {
  try {
      var room = rooms[roomId];
      if (!room)
          return;
      var member = room.getMember(socket.request.user._id);
      member.webcam = false;
      _.remove(room.channelList, function(channel) {
        return channel === socket.request.user._id;
    });
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
          id: 'broadcastMember',
          memberList: room.getMemberList()
      }));
      io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
        id: 'broadcastChannel',
        channelList: room.channelList()
    }));
  } catch (exc) {
      console.log('Unregister webcam exception', exc, roomId, room.getMemberList())
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
        console.log('Hand up exception', exc, roomId, room.getMemberList())
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
        console.log('Hand down exception', exc, roomId, room.getMemberList())
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

function publishChannel(io, socket, roomId, memberId) {
    try {
        var room = rooms[roomId];
        if (!room)
            return;
        var member = room.getMember(memberId);
        if (member.webcam) {
          member.invited = true;
          member.handUp = false;
          if (room.channelList.indexOf(memberId) === -1)
            room.channelList.push(memberId);
          io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
              id: 'broadcastMember',
              memberList: room.getMemberList()
          }));
          io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
            id: 'broadcastChannel',
            channelList: room.channelList
        }));
        }
    } catch (exc) {
        console.log('Publish exception', exc, roomId, room.getMemberList(), memberId)
    }

}

function unpublishChannel(io, socket, roomId, memberId) {
    try {
        var room = rooms[roomId];
        if (!room)
            return;
        var member = room.getMember(memberId);
        member.invited = false;
        _.remove(room.channelList, function(channel) {
            return channel === memberId;
        });
        io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
            id: 'broadcastMember',
            memberList: room.getMemberList()
        }));
        io.to(roomId).emit(CHANNEL_ID, JSON.stringify({
            id: 'broadcastChannel',
            channelList: room.channelList
        }));
    } catch (exc) {
        console.log('Unpublish exception', exc, roomId, room.getMemberList(), memberId)
    }
}

function disconnect(io,socket, sessionId) {
    try {
        _.each(rooms, function(room) {
            var member = room.getMemberBySession(sessionId);
            if (member) {
                room.removeMember(member);
                _.remove(room.channelList, function(channel) {
                    return channel === socket.request.user._id;
                });
                 io.to(room.roomId).emit(CHANNEL_ID, JSON.stringify({
                     id: 'broadcastMember',
                     memberList: room.getMemberList()
                 }));
                 io.to(room.roomId).emit(CHANNEL_ID, JSON.stringify({
                     id: 'broadcastChannel',
                     channelList: room.channelList
                 }));
            }
            
        });
        
    } catch (exc) {
        console.log('Disconnect exception', exc)
    }
}

module.exports = function(io, socket) {
    var sessionId = nextId++;
    socket.on('disconnect', function () {
      disconnect(io,socket, sessionId);
    });

    socket.on(CHANNEL_ID, function(message) {
        console.log(CHANNEL_ID, ' receive: ', message);

        switch (message.id) {
        case 'join':
            join(io, socket, message.roomId, sessionId);
            break;
        case 'leave':
            leave(io, socket, message.roomId);
            break;
        case 'publishChannel':
            publishChannel(io, socket, message.roomId, message.memberId);
            break;
        case 'unpublishChannel':
            unpublishChannel(io, socket, message.roomId, message.memberId);
            break;
        case 'registerChannel':
            registerChannel(io, socket, message.roomId);
            break;
        case 'unregisterChannel':
            unregisterChannel(io, socket, message.roomId);
            break;
        case 'handUp':
            handUp(io, socket, message.roomId);
            break;
        case 'handDown':
            handDown(io, socket, message.roomId);
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
