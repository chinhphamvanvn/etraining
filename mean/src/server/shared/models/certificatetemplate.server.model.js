'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * CertificateTemplate Schema
 */
var CertificateTemplateSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Certificatetemplate name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  urlImage: {
    type: String,
    default: '',
    trim: true
  },
  pathHtml: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('CertificateTemplate', CertificateTemplateSchema);
