'use strict';

/**
 * Module dependencies
 */
var forumsPolicy = require('../policies/forums.server.policy'),
  forums = require('../controllers/forums.server.controller');

module.exports = function(app) {
  // Forums Routes
  app.route('/api/forums').all(forumsPolicy.isAllowed)
    .get(forums.list)
    .post(forums.create);

  app.route('/api/forums/byCourse/:courseId').all(forumsPolicy.isAllowed)
  .get(forums.forumByCourseID)
  
  app.route('/api/forums/:forumId').all(forumsPolicy.isAllowed)
    .get(forums.read)
    .put(forums.update)
    .delete(forums.delete);

  // Finish by binding the Forum middleware
  app.param('forumId', forums.forumByID);
};
