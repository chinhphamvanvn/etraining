'use strict';

/**
 * Module dependencies
 */
var schemesPolicy = require('../policies/schemes.server.policy'),
  schemes = require('../controllers/schemes.server.controller');

module.exports = function(app) {
  // Schemes Routes
  app.route('/api/schemes').all(schemesPolicy.isAllowed)
    .get(schemes.list)
    .post(schemes.create);

  app.route('/api/schemes/byEdition/:editionId').all(schemesPolicy.isAllowed)
    .get(schemes.gradeSchemeByEditionID);

  app.route('/api/schemes/:schemeId').all(schemesPolicy.isAllowed)
    .get(schemes.read)
    .put(schemes.update)
    .delete(schemes.delete);

  // Finish by binding the Scheme middleware
  app.param('schemeId', schemes.schemeByID);
};
