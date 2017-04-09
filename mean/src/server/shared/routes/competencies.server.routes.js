'use strict';

/**
 * Module dependencies
 */
var competenciesPolicy = require('../policies/competencies.server.policy'),
  competencies = require('../controllers/competencies.server.controller');

module.exports = function(app) {
  // Competencies Routes
  app.route('/api/competencies').all(competenciesPolicy.isAllowed)
    .get(competencies.list)
    .post(competencies.create);

  app.route('/api/competencies/byGroup/:groupId').all(competenciesPolicy.isAllowed)
    .get(competencies.listByGroup);

  app.route('/api/competencies/:competencyId').all(competenciesPolicy.isAllowed)
    .get(competencies.read)
    .put(competencies.update)
    .delete(competencies.delete);

  // Finish by binding the Competency middleware
  app.param('competencyId', competencies.competencyByID);
};
