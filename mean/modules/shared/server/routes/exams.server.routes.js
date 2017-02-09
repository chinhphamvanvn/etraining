'use strict';

/**
 * Module dependencies
 */
var examsPolicy = require('../policies/exams.server.policy'),
  exams = require('../controllers/exams.server.controller');

module.exports = function(app) {
  // Exams Routes
  app.route('/api/exams').all(examsPolicy.isAllowed)
    .get(exams.list)
    .post(exams.create);
  
  app.route('/api/exams/:examId/logo').post(exams.changeExamLogo);
  
  app.route('/api/exams/public').all(examsPolicy.isAllowed)
  .get(exams.listPublished)

  app.route('/api/exams/:examId').all(examsPolicy.isAllowed)
    .get(exams.read)
    .put(exams.update)
    .delete(exams.delete);

  // Finish by binding the Exam middleware
  app.param('examId', exams.examByID);
};
