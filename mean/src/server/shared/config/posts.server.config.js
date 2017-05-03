'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Posts module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/posts'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/posts',name:'Post'});
      endpoint.save();
    }
  });
};
