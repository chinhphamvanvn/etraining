'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Annoucement = mongoose.model('Annoucement'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Annoucement
 */
exports.create = function(req, res) {
  var annoucement = new Annoucement(req.body);
  annoucement.user = req.user;

  annoucement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(annoucement);
    }
  });
};

/* Distriute message */
exports.distribute = function(req, res) {
    var annoucement = req.annoucement ? req.annoucement.toJSON() : {};
    var users = req.params.users.split(',');
    _.each(users,function(user) {  
        var alert = new Message({title:annoucement.title,content:annoucement.content,level:'success',type:'message',recipient: user});
        alert.save();
    });
    res.jsonp(annoucement);
  };

/**
 * Show the current Annoucement
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var annoucement = req.annoucement ? req.annoucement.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  annoucement.isCurrentUserOwner = req.user && annoucement.user && annoucement.user._id.toString() === req.user._id.toString();

  res.jsonp(annoucement);
};

/**
 * Update a Annoucement
 */
exports.update = function(req, res) {
  var annoucement = req.annoucement;

  annoucement = _.extend(annoucement, req.body);

  annoucement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(annoucement);
    }
  });
};

/**
 * Delete an Annoucement
 */
exports.delete = function(req, res) {
  var annoucement = req.annoucement;

  annoucement.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(annoucement);
    }
  });
};

/**
 * List of Annoucements
 */
exports.list = function(req, res) {
  Annoucement.find().sort('-created').populate('user', 'displayName').exec(function(err, annoucements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(annoucements);
    }
  });
};

exports.listPublished = function(req, res) {
    Annoucement.find({published:true,scope:'public'}).sort('-created').populate('user', 'displayName').exec(function(err, annoucements) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(annoucements);
      }
    });
  };

/**
 * Annoucement middleware
 */
exports.annoucementByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Annoucement is invalid'
    });
  }

  Annoucement.findById(id).populate('user', 'displayName').exec(function (err, annoucement) {
    if (err) {
      return next(err);
    } else if (!annoucement) {
      return res.status(404).send({
        message: 'No Annoucement with that identifier has been found'
      });
    }
    req.annoucement = annoucement;
    next();
  });
};
