'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Groups module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/groups'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/groups',name:'Group'});
      endpoint.save();
    }
  });
};
