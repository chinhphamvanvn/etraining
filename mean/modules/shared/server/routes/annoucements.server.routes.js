'use strict';

/**
 * Module dependencies
 */
var annoucementsPolicy = require('../policies/annoucements.server.policy'),
  annoucements = require('../controllers/annoucements.server.controller');

module.exports = function(app) {
  // Annoucements Routes
  app.route('/api/annoucements').all(annoucementsPolicy.isAllowed)
    .get(annoucements.list)
    .post(annoucements.create);
  
  app.route('/api/annoucements/distribute/:annoucementId/:users').all(annoucementsPolicy.isAllowed)
  .post(annoucements.distribute)
  
  app.route('/api/annoucements/public').all(annoucementsPolicy.isAllowed)
  .get(annoucements.listPublished)

  app.route('/api/annoucements/:annoucementId').all(annoucementsPolicy.isAllowed)
    .get(annoucements.read)
    .put(annoucements.update)
    .delete(annoucements.delete);

  // Finish by binding the Annoucement middleware
  app.param('annoucementId', annoucements.annoucementByID);
};
