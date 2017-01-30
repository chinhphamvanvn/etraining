'use strict';

/**
 * Module dependencies
 */
var editionsPolicy = require('../policies/editions.server.policy'),
  editions = require('../controllers/editions.server.controller');

module.exports = function(app) {
  // Editions Routes
  app.route('/api/editions').all(editionsPolicy.isAllowed)
    .get(editions.list)
    .post(editions.create);
  
  app.route('/api/editions/byCourse/:courseId').all(editionsPolicy.isAllowed)
  .get(editions.editionByCourseID);

  app.route('/api/editions/:editionId').all(editionsPolicy.isAllowed)
    .get(editions.read)
    .put(editions.update)
    .delete(editions.delete);

  // Finish by binding the Edition middleware
  app.param('editionId', editions.editionByID);
};
