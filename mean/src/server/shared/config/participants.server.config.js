'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Participants module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/participants'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/participants',name:'Participant'});
      endpoint.save();
    }
  });
};
