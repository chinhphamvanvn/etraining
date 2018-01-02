'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Videos module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/videos'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/videos',name:'Video'});
      endpoint.save();
    }
  });
};
