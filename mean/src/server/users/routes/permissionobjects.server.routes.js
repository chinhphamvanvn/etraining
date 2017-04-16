'use strict';

/**
 * Module dependencies
 */
var permissionobjectsPolicy = require('../policies/permissionobjects.server.policy'),
  permissionobjects = require('../controllers/permissionobjects.server.controller');

module.exports = function(app) {
  // Permissionobjects Routes
  app.route('/api/permissionobjects').all(permissionobjectsPolicy.isAllowed)
    .get(permissionobjects.list)
    .post(permissionobjects.create);

  app.route('/api/permissionobjects/:permissionobjectId').all(permissionobjectsPolicy.isAllowed)
    .get(permissionobjects.read)
    .put(permissionobjects.update)
    .delete(permissionobjects.delete);

  // Finish by binding the Permissionobject middleware
  app.param('permissionobjectId', permissionobjects.permissionobjectByID);
};
