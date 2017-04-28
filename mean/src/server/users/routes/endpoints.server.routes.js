'use strict';

/**
 * Module dependencies
 */
var endpointsPolicy = require('../policies/endpoints.server.policy'),
  endpoints = require('../controllers/endpoints.server.controller');

module.exports = function(app) {
  // Endpoints Routes
  app.route('/api/endpoints').all(endpointsPolicy.isAllowed)
    .get(endpoints.list)
    .post(endpoints.create);

  app.route('/api/endpoints/:endpointId').all(endpointsPolicy.isAllowed)
    .get(endpoints.read)
    .put(endpoints.update)
    .delete(endpoints.delete);

  // Finish by binding the Endpoint middleware
  app.param('endpointId', endpoints.endpointByID);
};
