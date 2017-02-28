'use strict';

/**
 * Module dependencies
 */
var materialsPolicy = require('../policies/materials.server.policy'),
  materials = require('../controllers/materials.server.controller');

module.exports = function(app) {
  // Materials Routes
  app.route('/api/materials').all(materialsPolicy.isAllowed)
    .get(materials.list)
    .post(materials.create);

  app.route('/api/materials/byCourse/:editionId').all(materialsPolicy.isAllowed)
  .get(materials.listByCourse)
  
  app.route('/api/materials/upload').post(materials.uploadCourseMaterial);
  
  app.route('/api/materials/:materialId').all(materialsPolicy.isAllowed)
    .get(materials.read)
    .put(materials.update)
    .delete(materials.delete);

  // Finish by binding the Material middleware
  app.param('materialId', materials.materialByID);
};
