'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Permissionobject Schema
 */
var PermissionApiSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Permission API name',
    trim: true
  },
  endpoints: {
    type: [{
      id: {
        type: Schema.ObjectId,
        ref: 'Endpoint'
      },
      create: {
        type: Boolean,
        default: false
      },
      view: {
        type: Boolean,
        default: true
      },
      update: {
        type: Boolean,
        default: false
      },
      delete: {
        type: Boolean,
        default: false
      }
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

mongoose.model('PermissionApi', PermissionApiSchema);
