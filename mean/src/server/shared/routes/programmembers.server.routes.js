'use strict';

/**
 * Module dependencies
 */
var programmembersPolicy = require('../policies/programmembers.server.policy'),
  programmembers = require('../controllers/programmembers.server.controller');

module.exports = function(app) {
  // Programmembers Routes
  app.route('/api/programmembers').all(programmembersPolicy.isAllowed)
    .get(programmembers.list)
    .post(programmembers.create);

  app.route('/api/programmembers/byProgram/:programId').all(programmembersPolicy.isAllowed)
    .get(programmembers.memberByProgram);

  app.route('/api/programmembers/byUser/:userId').all(programmembersPolicy.isAllowed)
    .get(programmembers.memberByUser);

  app.route('/api/programmembers/withdraw/:programmemberId').all(programmembersPolicy.isAllowed)
    .put(programmembers.withdraw);

  app.route('/api/programmembers/complete/:programmemberId/:teacherId').all(programmembersPolicy.isAllowed)
    .put(programmembers.complete);

  app.route('/api/programmembers/byUserAndProgram/:userId/:programId').all(programmembersPolicy.isAllowed)
    .get(programmembers.memberByUserAndProgram);

  app.route('/api/programmembers/:programmemberId').all(programmembersPolicy.isAllowed)
    .get(programmembers.read)
    .put(programmembers.update)
    .delete(programmembers.delete);

  // Finish by binding the Programmember middleware
  app.param('programmemberId', programmembers.programmemberByID);
};
