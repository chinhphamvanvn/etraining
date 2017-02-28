'use strict';

/**
 * Module dependencies
 */
var mediaPolicy = require('../policies/media.server.policy'),
  media = require('../controllers/media.server.controller');

module.exports = function (app) {
  // Media Routes
  app.route('/api/media').all(mediaPolicy.isAllowed)
    .get(media.list)
    .post(media.create);

  app.route('/api/media/byGroup/:groupId').all(mediaPolicy.isAllowed)
    .get(media.listByGroup);

  app.route('/api/media/upload').post(media.uploadMediaContent);

  app.route('/api/media/search').all(mediaPolicy.isAllowed)
    .get(media.listByKeyword);

  app.route('/api/media/:mediumId').all(mediaPolicy.isAllowed)
    .get(media.read)
    .put(media.update)
    .delete(media.delete);

  app.route('/api/media/:mediumId/image').post(media.chaangeMediaImage);

  // Finish by binding the Medium middleware
  app.param('mediumId', media.mediumByID);
};
