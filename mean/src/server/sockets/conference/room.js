var _ = require('underscore');
var Member = require('./member.js')

function Room(roomId)
{
    this.roomId = roomId;
    this.memberList = {};
    this.channelList = [];
    this.presentation = null;
}

Room.prototype.addMember = function(member)
{
    this.memberList[member.memberId] = member;
}

Room.prototype.removeMember = function(member)
{
    delete this.memberList[member.memberId];
}
Room.prototype.getMember = function(memberId)
{
    return this.memberList[memberId];
}
Room.prototype.getMemberList = function()
{
  return _.map(this.memberList, function(member)
      {
          return {
              memberId: member.memberId,
              handUp: member.handUp,
              invited: member.invited
          }
      });
}

module.exports = Room
