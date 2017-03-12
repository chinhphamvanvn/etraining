'use strict';

/**
 * Module dependencies
 */
var membersPolicy = require('../policies/members.server.policy'),
  members = require('../controllers/members.server.controller');

module.exports = function(app) {
  // Members Routes
  app.route('/api/members').all(membersPolicy.isAllowed)
    .get(members.list)
    .post(members.create);

  app.route('/api/members/byCourse/:courseId').all(membersPolicy.isAllowed)
  .get(members.memberByCourse);
  
  app.route('/api/members/byClass/:classroomId').all(membersPolicy.isAllowed)
  .get(members.memberByClass);
  
  app.route('/api/members/byUser/:userId').all(membersPolicy.isAllowed)
  .get(members.memberByUser);
  
  app.route('/api/members/withdraw/:memberId').all(membersPolicy.isAllowed)
  .put(members.withdraw);
  
  app.route('/api/members/byUserAndCourse/:userId/:courseId').all(membersPolicy.isAllowed)
  .get(members.memberByUserAndCourse);
  
  app.route('/api/members/:memberId').all(membersPolicy.isAllowed)
    .get(members.read)
    .put(members.update)
    .delete(members.delete);

  // Finish by binding the Member middleware
  app.param('memberId', members.memberByID);
};
