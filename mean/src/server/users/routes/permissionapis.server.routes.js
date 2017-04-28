'use strict';

/**
 * Module dependencies
 */
var permissionapisPolicy = require('../policies/permissionapis.server.policy'),
  permissionapis = require('../controllers/permissionapis.server.controller');

module.exports = function(app) {
  // Permissionobjects Routes
  app.route('/api/permissionapis').all(permissionapisPolicy.isAllowed)
    .get(permissionapis.list)
    .post(permissionapis.create);

  app.route('/api/permissionapis/:permissionapiId').all(permissionapisPolicy.isAllowed)
    .get(permissionapis.read)
    .put(permissionapis.update)
    .delete(permissionapis.delete);

  // Finish by binding the Permissionobject middleware
  app.param('permissionapiId', permissionapis.permissionapiByID);
};
