'use strict';

/**
 * Module dependencies
 */
var certificatesPolicy = require('../policies/certificates.server.policy'),
  certificates = require('../controllers/certificates.server.controller');

module.exports = function(app) {
  // Certificates Routes
  app.route('/api/certificates').all(certificatesPolicy.isAllowed)
    .get(certificates.list)
    .post(certificates.grant);

  app.route('/api/certificates/byMember/:memberId').all(certificatesPolicy.isAllowed)
    .get(certificates.certificateByMember);

  app.route('/api/certificates/:certificateId').all(certificatesPolicy.isAllowed)
    .get(certificates.read)
    .put(certificates.update)
    .delete(certificates.delete);

  // Finish by binding the Certificate middleware
  app.param('certificateId', certificates.certificateByID);
};
