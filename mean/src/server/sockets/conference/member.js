var kurento = require('kurento-client');

function Member(memberId, sessionId)
{
    this.memberId = memberId;
    this.sessionId = sessionId;
}

module.exports = Member