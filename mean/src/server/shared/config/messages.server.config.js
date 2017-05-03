'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Messages module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/messages'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/messages',name:'Message'});
      endpoint.save();
    }
  });
};
