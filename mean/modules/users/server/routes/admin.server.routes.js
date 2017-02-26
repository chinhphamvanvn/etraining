'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  
  app.route('/api/users/bulk')
  .post(adminPolicy.isAllowed, admin.bulkCreate);
  
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list)
    .post(adminPolicy.isAllowed, admin.create);
  
  app.route('/api/users/group/:groupId')
  .get(adminPolicy.isAllowed, admin.userByGroup);
  
  app.route('/api/users/:userId/picture').post(admin.changeProfilePicture);
  app.route('/api/logs/:userId').get(admin.logs);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
