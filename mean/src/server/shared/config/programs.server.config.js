'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Programs module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/programs'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/programs',name:'Program'});
      endpoint.save();
    }
  });
};
