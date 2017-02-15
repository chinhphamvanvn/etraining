'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CourseMaterial = mongoose.model('CourseMaterial'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a Material
 */
exports.create = function(req, res) {
  var material = new CourseMaterial(req.body);
  material.user = req.user;

  material.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(material);
    }
  });
};

/**
 * Show the current Material
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var material = req.material ? req.material.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  material.isCurrentUserOwner = req.user && material.user && material.user._id.toString() === req.user._id.toString();

  res.jsonp(material);
};

/**
 * Update a Material
 */
exports.update = function(req, res) {
  var material = req.material;

  material = _.extend(material, req.body);

  material.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(material);
    }
  });
};

/**
 * Delete an Material
 */
exports.delete = function(req, res) {
  var material = req.material;

  material.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        var existFilename = config.uploads.file.document.dest+ path.basename(material.downloadURL);
        fs.unlink(existFilename, function (unlinkError) {
            if (unlinkError) {
                res.status(422).send({
                    message: unlinkError
                  });
            } else {
                res.jsonp(material);
            }
          });
    }
  });
};


/**
 * List of CourseMaterials
 */
exports.list = function(req, res) {
  CourseMaterial.find().sort('-created').populate('user', 'displayName').exec(function(err, materials) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(materials);
    }
  });
};

/**
 * List of CourseMaterials
 */
exports.listByCourse = function(req, res) {
  CourseMaterial.find({edition:req.edition._id}).sort('-created').populate('user', 'displayName').exec(function(err, materials) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(materials);
    }
  });
};

/**
 * Material middleware
 */
exports.materialByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Material is invalid'
    });
  }

  CourseMaterial.findById(id).populate('user', 'displayName').exec(function (err, material) {
    if (err) {
      return next(err);
    } else if (!material) {
      return res.status(404).send({
        message: 'No Material with that identifier has been found'
      });
    }
    req.material = material;
    next();
  });
};


exports.uploadCourseMaterial = function (req, res) {
    // Filtering to upload only images
    var multerConfig = config.uploads.file.document;
    var upload = multer(multerConfig).single('newCourseMaterial');

      uploadMaterial()
        .then(function (result) {
          res.json(result);
        })
        .catch(function (err) {
          res.status(422).send(err);
        });
     
    function uploadMaterial () {
      return new Promise(function (resolve, reject) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
            reject(errorHandler.getErrorMessage(uploadError));
          } else {
              var downloadURL = config.uploads.file.document.urlPaath + req.file.filename;
              var originalname =  req.file.originalname;
              resolve({downloadURL:downloadURL,filename:originalname});
          }
        });
      });
    }

  };

