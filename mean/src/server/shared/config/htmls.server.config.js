'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Htmls module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/htmls'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/htmls',name:'Html'});
      endpoint.save();
    }
  });
};
