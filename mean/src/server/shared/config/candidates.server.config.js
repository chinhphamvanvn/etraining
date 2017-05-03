'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Candidates module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/candidates'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/candidates',name:'Candidate'});
      endpoint.save();
    }
  });
};
