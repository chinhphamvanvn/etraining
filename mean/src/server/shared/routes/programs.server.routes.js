'use strict';

/**
 * Module dependencies
 */
var programsPolicy = require('../policies/programs.server.policy'),
  programs = require('../controllers/programs.server.controller');

module.exports = function(app) {
  // Programs Routes
  app.route('/api/programs').all(programsPolicy.isAllowed)
    .get(programs.list)
    .post(programs.create);

  app.route('/api/programs/public').all(programsPolicy.isAllowed)
    .get(programs.listPublic);
  app.route('/api/programs/private').all(programsPolicy.isAllowed)
    .get(programs.listPrivate);
  app.route('/api/programs/restricted').all(programsPolicy.isAllowed)
    .get(programs.listRestricted);

  app.route('/api/programs/:programId').all(programsPolicy.isAllowed)
    .get(programs.read)
    .put(programs.update)
    .delete(programs.delete);

  // Finish by binding the Program middleware
  app.param('programId', programs.programByID);
};
