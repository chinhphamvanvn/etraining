'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Topics module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/topics'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/topics',name:'Topic'});
      endpoint.save();
    }
  });
};
