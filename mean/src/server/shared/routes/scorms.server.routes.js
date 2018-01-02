'use strict';

/**
 * Module dependencies
 */
var scormsPolicy = require('../policies/scorms.server.policy'),
  scorms = require('../controllers/scorms.server.controller');

module.exports = function(app) {
  // scorms Routes
  app.route('/api/scorms').all(scormsPolicy.isAllowed)
    .get(scorms.list)
    .post(scorms.create);

  app.route('/api/scorms/:scormId').all(scormsPolicy.isAllowed)
    .get(scorms.read)
    .put(scorms.update)
    .delete(scorms.delete);

  // Finish by binding the scorm middleware
  app.param('scormId', scorms.scormByID);
};
