'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Competencies module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/competencies'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/competencies',name:'Competencie'});
      endpoint.save();
    }
  });
};
