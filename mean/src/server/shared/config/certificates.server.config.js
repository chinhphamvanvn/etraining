'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Certificates module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/certificates'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/certificates',name:'Certificate'});
      endpoint.save();
    }
  });
};
