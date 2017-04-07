'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Conference = mongoose.model('Conference'),
  Setting = mongoose.model('Setting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
var sha1 = require('sha1');
var url = require('url');

/**
 * Create a Conference
 */
exports.create = function(req, res) {
  var conference = new Conference(req.body);
  conference.user = req.user;
  var apiUrl = '',
    apiSalt = '';

  verifyNotExistConference(conference)
    .then(getApiUrl)
    .then(getApiSalt)
    .then(function() {
      var meeting = {
        name: conference.name,
        meetingRef: conference.classroom,
        active: true,
        domain: '',
        type: 'training'
      };
      var checksum = sha1(JSON.stringify({ meeting: meeting }) + apiSalt);
      console.log(checksum);
      var URL = url.parse(apiUrl);
      var protocol = URL.protocol === 'http' ? require('http') : require('https');
      var options = {
        hostname: URL.hostname,
        port: URL.port,
        path: '/api/trusted/meeting',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
      };
      var apiReq = protocol.request(options, function(apiRes) {
        apiRes.setEncoding('utf8');
        var data = [];
        apiRes.on('data', function(chunk) {
          data.push(chunk);
        });
        apiRes.on('end', function() {
          var result = JSON.parse(data.join(''));
          if (!result.status) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage('Error from API server')
            });
          }
          conference.meetingId = result.id;
          conference.save(function(err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(conference);
            }
          });
        });
      });
      apiReq.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        return res.status(422).send({
          message: errorHandler.getErrorMessage(e)
        });
      });
      apiReq.write(JSON.stringify({
        payload: JSON.stringify({
          meeting: meeting
        }),
        checksum: checksum
      }));
      apiReq.end();
    });

  function verifyNotExistConference(conference) {
    return new Promise(function(resolve, reject) {
      Conference.findOne({
        classroom: conference.classroom
      }).exec(function(err, existConference) {
        if (err || existConference)
          reject({
            message: 'Conference already exist'
          });
        else
          resolve();
      });
    });
  }

  function getApiUrl() {
    return new Promise(function(resolve, reject) {
      Setting.findOne({
        code: 'BUILT_INT_CONFERENCE_API'
      }).exec(function(err, setting) {
        if (err || !setting)
          reject({
            message: 'Cannot find API URL'
          });
        else {
          apiUrl = setting.valueString;
          resolve(setting);
        }
      });
    });
  }

  function getApiSalt() {
    return new Promise(function(resolve, reject) {
      Setting.findOne({
        code: 'BUILT_INT_CONFERENCE_API_SALT'
      }).exec(function(err, setting) {
        if (err || !setting)
          reject({
            message: 'Cannot find API Salt'
          });
        else {
          apiSalt = setting.valueString;
          resolve(setting);
        }
      });
    });
  }
};

/**
 * Show the current Conference
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var conference = req.conference ? req.conference.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  conference.isCurrentUserOwner = req.user && conference.user && conference.user._id.toString() === req.user._id.toString();
  res.jsonp(conference);
};

/**
 * Update a Conference
 */
exports.update = function(req, res) {
  var conference = req.conference;

  conference = _.extend(conference, req.body);

  conference.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conference);
    }
  });
};

/**
 * Delete an Conference
 */
exports.delete = function(req, res) {
  var conference = req.conference;

  conference.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conference);
    }
  });
};

/**
 * List of Conferences
 */
exports.list = function(req, res) {
  Conference.find().sort('-created').populate('user', 'displayName').exec(function(err, conferences) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conferences);
    }
  });
};

exports.conferenceByClass = function(req, res) {
  Conference.findOne({
    classroom: req.classroom._id
  }).sort('-created').populate('user', 'displayName').exec(function(err, conferences) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conferences);
    }
  });
};

/**
 * Conference middleware
 */
exports.conferenceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Conference is invalid'
    });
  }

  Conference.findById(id).populate('user', 'displayName').exec(function(err, conference) {
    if (err) {
      return next(err);
    } else if (!conference) {
      return res.status(404).send({
        message: 'No Conference with that identifier has been found'
      });
    }
    req.conference = conference;
    next();
  });
};
