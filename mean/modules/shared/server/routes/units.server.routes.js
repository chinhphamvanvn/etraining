'use strict';

/**
 * Module dependencies
 */
var unitsPolicy = require('../policies/units.server.policy'),
  units = require('../controllers/units.server.controller');

module.exports = function(app) {
  // Units Routes
  app.route('/api/units').all(unitsPolicy.isAllowed)
    .get(units.list)
    .post(units.create);

  app.route('/api/units/:unitId').all(unitsPolicy.isAllowed)
    .get(units.read)
    .put(units.update)
    .delete(units.delete);

  // Finish by binding the Unit middleware
  app.param('unitId', units.unitByID);
};
