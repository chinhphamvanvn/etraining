'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Editions module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/editions'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/editions',name:'Edition'});
      endpoint.save();
    }
  });
};
