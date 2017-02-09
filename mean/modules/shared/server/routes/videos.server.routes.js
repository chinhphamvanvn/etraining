'use strict';

/**
 * Module dependencies
 */
var videosPolicy = require('../policies/videos.server.policy'),
  videos = require('../controllers/videos.server.controller');

module.exports = function(app) {
  // Videos Routes
  app.route('/api/videos').all(videosPolicy.isAllowed)
    .get(videos.list)
    .post(videos.create);

  app.route('/api/videos/:videoId').all(videosPolicy.isAllowed)
    .get(videos.read)
    .put(videos.update)
    .delete(videos.delete);

  // Finish by binding the Video middleware
  app.param('videoId', videos.videoByID);
};
