'use strict';

/**
 * Module dependencies
 */
var groupsPolicy = require('../policies/groups.server.policy'),
  groups = require('../controllers/groups.server.controller');

module.exports = function(app) {
  // Groups Routes
  app.route('/api/groups').all(groupsPolicy.isAllowed)
    .post(groups.create);

  app.route('/api/groups/organization').all(groupsPolicy.isAllowed)
  .get(groups.listOrganizationGroup);
  
  app.route('/api/groups/course').all(groupsPolicy.isAllowed)
  .get(groups.listCourseGroup);
  
  app.route('/api/groups/library').all(groupsPolicy.isAllowed)
  .get(groups.listLibraryGroup);
  
  app.route('/api/groups/competency').all(groupsPolicy.isAllowed)
  .get(groups.listCompetencyGroup);
  
  app.route('/api/groups/question').all(groupsPolicy.isAllowed)
  .get(groups.listQuestionGroup);

  app.route('/api/groups/:groupId').all(groupsPolicy.isAllowed)
    .get(groups.read)
    .put(groups.update)
    .delete(groups.delete);

  // Finish by binding the Group middleware
  app.param('groupId', groups.groupByID);
};
