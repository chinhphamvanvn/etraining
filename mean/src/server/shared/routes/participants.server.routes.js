'use strict';

/**
 * Module dependencies
 */
var participantsPolicy = require('../policies/participants.server.policy'),
  participants = require('../controllers/participants.server.controller');

module.exports = function(app) {
  // Participants Routes
  app.route('/api/participants').all(participantsPolicy.isAllowed)
    .get(participants.list)
    .post(participants.create);

  app.route('/api/participants/byMember/:memberId').all(participantsPolicy.isAllowed)
    .get(participants.participantByMember);

  app.route('/api/participants/byConference/:conferenceId').all(participantsPolicy.isAllowed)
    .get(participants.listByConference);

  app.route('/api/participants/:participantId').all(participantsPolicy.isAllowed)
    .get(participants.read)
    .put(participants.update)
    .delete(participants.delete);

  // Finish by binding the Participant middleware
  app.param('participantId', participants.participantByID);
};
