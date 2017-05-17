'use strict';
var Room = require('./conference/room.js');
var Member = require('./conference/member.js');
var CHANNEL_ID = 'conference';
var rooms = {};

function join(io, socket, roomId) {
  var room = rooms[roomId];
  if (!room)  {
    console.log('Create new room', roomId)
    room = new Room(roomId);
  }
  var member = new Member(socket.request.user._id);
  room.addMember(member);
  rooms[roomId] = room;
  console.log('join room', roomId);
  socket.join(roomId, function(){
    console.log('Broadcast room');
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'broadcastMember', memberList:room.getMemberList()}));
  });
}

function leave(io, socket, roomId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  room.removeMember(member);
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'broadcastMember', memberList:room.getMemberList()}));
  });
}

function publishWebcam(io, socket, roomId, publisherId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  member.publisherId = publisherId;
  member.isPublisher = true;
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'broadcastMember', memberList:room.getMemberList()}));
  });
}

function unpublishWebcam(io, socket, roomId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  member.publisherId = null;
  member.isPublisher = false;
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'broadcastMember', memberList:room.getMemberList()}));
  });
}

function handUp(io, socket, roomId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  member.handUp = true;
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'broadcastMember', memberList:room.getMemberList()}));
  });
}

function handDown(io, socket, roomId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  member.handUp = false;
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'broadcastMember', memberList:room.getMemberList()}));
  });
}

function invite(io, socket, roomId, memberId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  member.invited = true;
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'invite', memberId:memberId}));
  });
}

function discard(io, socket, roomId, memberId) {
  var room = rooms[roomId];
  if (!room) 
    return;
  var member = room.getMember(socket.request.user._id);
  member.invited = false;
  socket.leave(roomId, function(){
    io.to(roomId).emit(CHANNEL_ID, JSON.stringify({id:'discard', memberId:memberId}));
  });
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
      case 'publishWebcam':
        publishWebcam(io, socket, message.roomId, message.publisherId);
        break;
      case 'unpublishWebcam':
        unpublishWebcam(io, socket, message.roomId);
        break;
      case 'handUp':
        handup(io, socket,message.roomId);
        break;
      case 'handDown':
        handDown(io, socket,message.roomId);
        break;
      case 'invite':
        invite(io, socket,message.roomId, message.memberId);
        break;
      case 'discard':
        discard(io, socket,message.roomId, message.memberId);
        break;
      default:
        console.log('Error to parse');
        break;
      }
    });

};
