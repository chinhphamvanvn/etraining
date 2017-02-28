'use strict';

/**
 * Module dependencies
 */
var topicsPolicy = require('../policies/topics.server.policy'),
  topics = require('../controllers/topics.server.controller');

module.exports = function(app) {
  // Topics Routes
  app.route('/api/topics').all(topicsPolicy.isAllowed)
    .get(topics.list)
    .post(topics.create);
  
  app.route('/api/topics/byForum/:forumId').all(topicsPolicy.isAllowed)
  .get(topics.listByForum)

  app.route('/api/topics/:topicId').all(topicsPolicy.isAllowed)
    .get(topics.read)
    .put(topics.update)
    .delete(topics.delete);

  // Finish by binding the Topic middleware
  app.param('topicId', topics.topicByID);
};
