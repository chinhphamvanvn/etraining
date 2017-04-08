'use strict';

/**
 * Module dependencies
 */
var conferencesPolicy = require('../policies/conferences.server.policy'),
  conferences = require('../controllers/conferences.server.controller');

module.exports = function(app) {
  // Conferences Routes
  app.route('/api/conferences').all(conferencesPolicy.isAllowed)
    .get(conferences.list)
    .post(conferences.create);

  app.route('/api/conferences/byClass/:classroomId').all(conferencesPolicy.isAllowed)
    .get(conferences.conferenceByClass);

  app.route('/api/conferences/:conferenceId').all(conferencesPolicy.isAllowed)
    .get(conferences.read)
    .put(conferences.update)
    .delete(conferences.delete);

  // Finish by binding the Conference middleware
  app.param('conferenceId', conferences.conferenceByID);
};
