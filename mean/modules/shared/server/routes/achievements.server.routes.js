'use strict';

/**
 * Module dependencies
 */
var achievementsPolicy = require('../policies/achievements.server.policy'),
  achievements = require('../controllers/achievements.server.controller');

module.exports = function(app) {
  // Achievements Routes
  app.route('/api/achievements').all(achievementsPolicy.isAllowed)
    .get(achievements.list)
    .post(achievements.create);

  app.route('/api/achievements/:achievementId').all(achievementsPolicy.isAllowed)
    .get(achievements.read)
    .put(achievements.update)
    .delete(achievements.delete);

  // Finish by binding the Achievement middleware
  app.param('achievementId', achievements.achievementByID);
};
