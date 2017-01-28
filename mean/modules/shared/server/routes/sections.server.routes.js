'use strict';

/**
 * Module dependencies
 */
var sectionsPolicy = require('../policies/sections.server.policy'),
  sections = require('../controllers/sections.server.controller');

module.exports = function(app) {
  // Sections Routes
  app.route('/api/sections').all(sectionsPolicy.isAllowed)
    .get(sections.list)
    .post(sections.create);

  app.route('/api/sections/:sectionId').all(sectionsPolicy.isAllowed)
    .get(sections.read)
    .put(sections.update)
    .delete(sections.delete);

  // Finish by binding the Section middleware
  app.param('sectionId', sections.sectionByID);
};
