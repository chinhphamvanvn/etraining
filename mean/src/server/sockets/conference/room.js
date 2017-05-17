var _ = require('underscore');
var Member = require('./member.js')

function Room(roomId)
{
    this.roomId = roomId;
    this.memberList = {};
}

Room.prototype.addMember = function(member)
{
    this.memberList[member.memberId] = member;
}

Room.prototype.removeMember = function(memberId)
{
    delete this.memberList[memberId];
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
              role: member.role
          }
      });
}

module.exports = Room
