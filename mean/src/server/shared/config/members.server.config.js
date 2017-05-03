'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Members module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/members'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/members',name:'Member'});
      endpoint.save();
    }
  });
};
