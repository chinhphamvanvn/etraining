'use strict';

/**
 * Module dependencies
 */
var htmlsPolicy = require('../policies/htmls.server.policy'),
  htmls = require('../controllers/htmls.server.controller');

module.exports = function(app) {
  // Htmls Routes
  app.route('/api/htmls').all(htmlsPolicy.isAllowed)
    .get(htmls.list)
    .post(htmls.create);

  app.route('/api/htmls/:htmlId').all(htmlsPolicy.isAllowed)
    .get(htmls.read)
    .put(htmls.update)
    .delete(htmls.delete);

  // Finish by binding the Html middleware
  app.param('htmlId', htmls.htmlByID);
};
