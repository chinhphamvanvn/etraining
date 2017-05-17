var kurento = require('kurento-client');

function Member(memberId, name, role)
{
    this.memberId = memberId;
    this.publisher = null;
}

module.exports = Member