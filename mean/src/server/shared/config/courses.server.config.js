'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Courses module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/courses'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/courses',name:'Course'});
      endpoint.save();
    }
  });
};
