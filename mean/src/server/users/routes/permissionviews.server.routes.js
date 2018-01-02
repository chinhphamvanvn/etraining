'use strict';

/**
 * Module dependencies
 */
var permissionviewsPolicy = require('../policies/permissionviews.server.policy'),
  permissionviews = require('../controllers/permissionviews.server.controller');

module.exports = function(app) {
  // Permissionviews Routes
  app.route('/api/permissionviews').all(permissionviewsPolicy.isAllowed)
    .get(permissionviews.list)
    .post(permissionviews.create);

  app.route('/api/permissionviews/:permissionviewId').all(permissionviewsPolicy.isAllowed)
    .get(permissionviews.read)
    .put(permissionviews.update)
    .delete(permissionviews.delete);

  // Finish by binding the Permissionview middleware
  app.param('permissionviewId', permissionviews.permissionviewByID);
};
