'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  config = require(path.resolve('./config/config'));

/**
 * Questions module init function.
 */
module.exports = function(app, db) {
  Endpoint.findOne({
    prefix: '/api/questions'
    }, function(err, endpointRecord) {
      if (err || !endpointRecord) {
        var endpoint = new Endpoint({prefix: '/api/questions',name:'Question'});
        endpoint.save();
      }
    });
};
