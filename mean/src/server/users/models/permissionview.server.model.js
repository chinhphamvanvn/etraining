'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Permissionview Schema
 */
var PermissionViewSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Permissionview name',
    trim: true
  },
  userMenu: {
    type: [{
      type: String,
    }]
  },
  adminMenu: {
    type: [{
      type: String
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

mongoose.model('PermissionView', PermissionViewSchema);
