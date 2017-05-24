'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Question = mongoose.model('Question'),
  Option = mongoose.model('Option'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

exports.bulkCreate = function(req, res) {
  var questions = req.body.questions;
  var promises = [];
  _.each(questions, function(question) {
    var promise = new Promise(function(resolve, reject) {
      var newQuestion = new Question(question);
      newQuestion.correctOptions = [];
      newQuestion.save(function(err) {
        if (err) {
          reject(err);
        } else {
          var correctOptions = question.correctOptions;
          var wrongOptions = question.wrongOptions;
          var optionPromises = [];
          var order = 1;
          _.each(correctOptions, function(content) {
            var optionPromise = new Promise(function(resolve, reject) {
              var option = new Option({
                content: content,
                question: newQuestion._id,
                order: order++
              });
              option.save(function(err) {
                console.log(option);
                if (err)
                  reject(err);
                else {
                  newQuestion.correctOptions.push(option._id);
                  newQuestion.save(function(err) {
                    resolve();
                  });
                }
              });
            });
            optionPromises.push(optionPromise);
          });
          _.each(wrongOptions, function(content) {
            var optionPromise = new Promise(function(resolve, reject) {
              var option = new Option({
                content: content,
                question: newQuestion._id,
                order: order++
              });
              option.save(function(err) {
                console.log(option);
                if (err)
                  reject(err);
                else {
                  resolve();
                }
              });
            });
            optionPromises.push(optionPromise);
          });
          Promise.all(optionPromises).then(
            function() {
              resolve();
            },
            function(err) {
              reject();
            });
        }
      });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(
    function() {
      res.json({
        success: true
      });
    },
    function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });

};

/**
 * Create a Question
 */
exports.create = function(req, res) {
  console.log(req.body);
  var question = new Question(req.body);
  question.user = req.user;
  question.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(question);
    }
  });
};

/**
 * Show the current Question
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var question = req.question ? req.question.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  question.isCurrentUserOwner = req.user && question.user && question.user._id.toString() === req.user._id.toString();

  res.jsonp(question);
};

/**
 * Update a Question
 */
exports.update = function(req, res) {
  var question = req.question;
  question = _.extend(question, req.body);
  question.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(question);
    }
  });
};

/**
 * Delete an Question
 */
exports.delete = function(req, res) {
  var question = req.question;

  question.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(question);
    }
  });
};

/**
 * List of Questions
 */
exports.list = function(req, res) {
  Question.find().sort('-created').populate('user', 'displayName').populate('category').exec(function(err, questions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questions);
    }
  });
};


exports.listByCategoryAndLevel = function(req, res) {
  Question.find({
    category: req.params.groupId,
    level: req.params.level
  }).sort('-created').populate('user', 'displayName').populate('category').exec(function(err, questions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questions);
    }
  });
};

exports.listByIds = function(req, res) {
  var questionIds = req.params.questionIds.split(',');
  Question.find({
    _id: {
      $in: questionIds
    }
  }).sort('-created').populate('user', 'displayName').populate('category').exec(function(err, questions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questions);
    }
  });
};

exports.listByCategory = function(req, res) {
  Question.find({
    category: req.group._id
  }).sort('-created').populate('user', 'displayName').populate('category').exec(function(err, questions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questions);
    }
  });
};

/**
 * Question middleware
 */
exports.questionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Question is invalid'
    });
  }

  Question.findById(id).populate('user', 'displayName').exec(function(err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(422).send({
        message: 'No Question with that identifier has been found'
      });
    }
    req.question = question;
    next();
  });
};


exports.uploadQuestionImage = function(req, res) {
  // Filtering to upload only images
  var multerConfig = config.uploads.question.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newQuestionImage');

  uploadImage()
    .then(function(imageURL) {
      res.json({
        imageURL: imageURL
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var imageURL = config.uploads.question.image.urlPath + req.file.filename;
          console.log(config.uploads.question);
          resolve(imageURL);
        }
      });
    });
  }

};

exports.uploadQuestionVideo = function(req, res) {
  // Filtering to upload only video
  var multerConfig = config.uploads.question.video;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).videoFileFilter;
  var upload = multer(multerConfig).single('newQuestionVideo');

  uploadVideo()
    .then(function(videoURL) {
      res.json({
        videoURL: videoURL
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadVideo() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var videoURL = config.uploads.question.video.urlPath + req.file.filename;
          resolve(videoURL);
        }
      });
    });
  }

};

exports.uploadQuestionAudio = function(req, res) {
  // Filtering to upload only audio
  var multerConfig = config.uploads.question.audio;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).audioFileFilter;
  var upload = multer(multerConfig).single('newQuestionAudio');

  uploadAudio()
    .then(function(audioURL) {
      res.json({
        audioURL: audioURL
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadAudio() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var audioURL = config.uploads.question.audio.urlPath + req.file.filename;
          resolve(audioURL);
        }
      });
    });
  }

};

exports.uploadQuestionFile = function(req, res) {
  // Filtering to upload only images
  var upload = multer(multerConfig).single('newQuestionFile');

  uploadFile()
    .then(function(fileURL) {
      res.json({
        fileURL: fileURL
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadFile() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var fileURL = config.uploads.question.document.urlPath + req.file.filename;
          resolve(fileURL);
        }
      });
    });
  }

};