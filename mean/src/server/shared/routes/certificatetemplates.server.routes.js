'use strict';

/**
 * Module dependencies
 */
var certificatetemplatesPolicy = require('../policies/certificatetemplates.server.policy'),
  certificatetemplates = require('../controllers/certificatetemplates.server.controller');

module.exports = function(app) {
  // Certificatetemplates Routes
  app.route('/api/certificatetemplates').all(certificatetemplatesPolicy.isAllowed)
    .get(certificatetemplates.list)
    .post(certificatetemplates.create);

  app.route('/api/certificatetemplates/:certificatetemplateId').all(certificatetemplatesPolicy.isAllowed)
    .get(certificatetemplates.read)
    .put(certificatetemplates.update)
    .delete(certificatetemplates.delete);

  // Finish by binding the Certificatetemplate middleware
  app.param('certificatetemplateId', certificatetemplates.certificatetemplateByID);
};
