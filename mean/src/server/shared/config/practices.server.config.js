'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));


module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/practices'
  }, function(err, endpointRecord) {
    if (err || !endpointRecord) {
      var endpoint = new Endpoint({prefix: '/api/practices',name:'Practice'});
      endpoint.save();
    }
  });
};
