'use strict';

/**
 * Module dependencies
 */
var exercisesPolicy = require('../policies/exercises.server.policy'),
  exercises = require('../controllers/exercises.server.controller');

module.exports = function(app) {
  // Exercises Routes
  app.route('/api/exercises').all(exercisesPolicy.isAllowed)
    .get(exercises.list)
    .post(exercises.create);

  app.route('/api/exercises/:exerciseId').all(exercisesPolicy.isAllowed)
    .get(exercises.read)
    .put(exercises.update)
    .delete(exercises.delete);

  // Finish by binding the Exercise middleware
  app.param('exerciseId', exercises.exerciseByID);
};
