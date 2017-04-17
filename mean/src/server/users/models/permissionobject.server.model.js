'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Permissionobject Schema
 */
var PermissionObjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Permissionobject name',
    trim: true
  },
  objects: {
    type: [{
      name: {
        type: String
      },
      actions: {
        type:  [{
          type: String,
          enum: ['POST', 'PUT', 'GET', 'DELETE']
        }]
      },
    }]
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('PermissionObject', PermissionObjectSchema);
