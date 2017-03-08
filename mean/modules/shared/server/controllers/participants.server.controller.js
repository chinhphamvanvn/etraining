'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Setting = mongoose.model('Setting'),
  CourseMember = mongoose.model('CourseMember'),
  Conference = mongoose.model('Conference'),
  ConferenceParticipant = mongoose.model('ConferenceParticipant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var sha1 = require('sha1');
var url = require('url');

/**
 * Create a Participant
 */

exports.create = function(req, res) {
    var participant = new ConferenceParticipant(req.body);
    participant.user = req.user;
    var apiUrl ='',apiSalt = '';
    var conferenceMember = {
            name: participant.name,      
            email: participant.email,
            meetingId: participant.meetingId,
            password:'123456',
            role: participant.isPresenter? 'presenter': 'viewer'
     }
    verifyNotExistConferenceParticipant(participant)
    .then(getApiUrl)
    .then(getApiSalt)
    .then(function() {
          var payload = JSON.stringify({member:conferenceMember,meetingId:conferenceMember.meetingId});
          var checksum = sha1(payload+apiSalt);
          console.log(checksum);
          var URL = url.parse(apiUrl);
          var protocol = URL.protocol=='http'? require("http"):require("https");
          var options = {
            hostname: URL.hostname,
            port: URL.port,
            path: '/api/trusted/member',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
          };
          var apiReq = protocol.request(options, function(apiRes) {
            apiRes.setEncoding('utf8');
            var data = [];
            apiRes.on('data', function(chunk) {
                console.log(chunk);
              data.push(chunk);
            });
            apiRes.on('end', function() {
              var result = JSON.parse(data.join(''));
              participant.memberId = result.id;
              if (!result.status) {
                  return res.status(422).send({
                      message: errorHandler.getErrorMessage('Error from API server')
                    });
              }
              getLoginUrl().then(function(roomUrl) {
                  participant.loginURL = roomUrl;
                  participant.save(function(err) {
                      if (err) {
                        return res.status(422).send({
                          message: errorHandler.getErrorMessage(err)
                        });
                      } else {
                        res.jsonp(participant);
                      }
                    });
              })
              
            });
          });
          apiReq.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
          });
          apiReq.write(JSON.stringify({payload:payload,checksum:checksum}));
          apiReq.end();
    }).catch(function(err) {
        console.log('Error: ' + err);
        return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
    });


    function verifyNotExistConferenceParticipant(participant) {
        return new Promise(function (resolve, reject) {
            ConferenceParticipant.findOne({member:participant.member}).exec(function (err, existParticipant) {
               if (err || existParticipant) 
                   reject({message:'Conference participant already exist'});
               else 
                   resolve();
            });
        });
    }
    
    function getApiUrl() {
        return new Promise(function (resolve, reject) {
            Setting.findOne({code:'BUILT_INT_CONFERENCE_API'}).exec(function (err, setting) {
               if (err || !setting) 
                   reject({message:'Cannot find API URL'});
               else {
                   apiUrl = setting.valueString;
                   resolve(setting);
               }
            });
        });
    }
    
    function getApiSalt() {
        return new Promise(function (resolve, reject) {
            Setting.findOne({code:'BUILT_INT_CONFERENCE_API_SALT'}).exec(function (err, setting) {
               if (err || !setting) 
                   reject({message:'Cannot find API Salt'});
               else {
                   apiSalt = setting.valueString;
                   resolve(setting);
               }
            });
        });
    }
    
    function getLoginUrl() {
        return new Promise(function (resolve, reject) {
            Setting.findOne({code:'BUILT_INT_CONFERENCE_ROOM_URL'}).exec(function (err, setting) {
               if (err || !setting) 
                   reject({message:'Cannot find API Salt'});
               else {
                   var roomUrl = setting.valueString;
                   roomUrl += '/trustedLogin?';
                   var payload = JSON.stringify({meetingId:conferenceMember.meetingId,email:conferenceMember.email,password:conferenceMember.password});
                   var checksum = sha1(payload+apiSalt);
                   roomUrl += 'payload=' + new Buffer(payload).toString('base64') +"&checksum=" + checksum;
                   resolve(roomUrl);
               }
            });
        });
    }
      
  }
/**
 * Show the current Participant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var participant = req.participant ? req.participant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  participant.isCurrentUserOwner = req.user && participant.user && participant.user._id.toString() === req.user._id.toString();

  res.jsonp(participant);
};

/**
 * Update a Participant
 */
exports.update = function(req, res) {
  var participant = req.participant;
  var apiUrl ='',apiSalt = '';
  participant = _.extend(participant, req.body);
  var conferenceMember = {
          name: participant.name,      
          email: participant.email,
          meetingId: participant.meetingId,
          password:'123456',
          role: participant.isPresenter? 'presenter': 'viewer'
   }
  
   getApiUrl()
  .then(getApiSalt)
  .then(function() {
        var payload = JSON.stringify({member:conferenceMember,meetingId:conferenceMember.meetingId});
        var checksum = sha1(payload+apiSalt);
        console.log(checksum);
        var URL = url.parse(apiUrl);
        var protocol = URL.protocol=='http'? require("http"):require("https");
        var options = {
          hostname: URL.hostname,
          port: URL.port,
          path: '/api/trusted/member',
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        };
        var apiReq = protocol.request(options, function(apiRes) {
          apiRes.setEncoding('utf8');
          apiRes.on('end', function() {
            if (!result.status) {
                return res.status(422).send({
                    message: errorHandler.getErrorMessage('Error from API server')
                  });
            }
            participant.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  res.jsonp(participant);
                }
              });
          });
        });
        apiReq.on('error', function(e) {
          console.log('problem with request: ' + e.message);
          return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
        });
        apiReq.write(JSON.stringify({payload:payload,checksum:checksum}));
        apiReq.end();
  }).catch(function(err) {
      console.log('Error: ' + err);
      return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
  });


  function getApiUrl() {
      return new Promise(function (resolve, reject) {
          Setting.findOne({code:'BUILT_INT_CONFERENCE_API'}).exec(function (err, setting) {
             if (err || !setting) 
                 reject({message:'Cannot find API URL'});
             else {
                 apiUrl = setting.valueString;
                 resolve(setting);
             }
          });
      });
  }
  
  function getApiSalt() {
      return new Promise(function (resolve, reject) {
          Setting.findOne({code:'BUILT_INT_CONFERENCE_API_SALT'}).exec(function (err, setting) {
             if (err || !setting) 
                 reject({message:'Cannot find API Salt'});
             else {
                 apiSalt = setting.valueString;
                 resolve(setting);
             }
          });
      });
  }

  
};

/**
 * Delete an Participant
 */
exports.delete = function(req, res) {
  var participant = req.participant;
  var apiUrl ='',apiSalt = '';
  getApiUrl()
  .then(getApiSalt)
  .then(function() {
        var payload = JSON.stringify({id:participant.memberId});
        var checksum = sha1(payload+apiSalt);
        console.log(checksum);
        var URL = url.parse(apiUrl);
        var protocol = URL.protocol=='http'? require("http"):require("https");
        var options = {
          hostname: URL.hostname,
          port: URL.port,
          path: '/api/trusted/member',
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(JSON.stringify({payload:payload,checksum:checksum}))
          },
          rejectUnauthorized: false,
          requestCert: true,
          agent: false
        };
        var apiReq = protocol.request(options, function(apiRes) {
        });
        apiReq.write(JSON.stringify({payload:payload,checksum:checksum}));
        apiReq.end();
        participant.remove(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(participant);
            }
          });
  }).catch(function(err) {
      console.log('Error: ' + err);
      return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
  });
  
  function getApiUrl() {
      return new Promise(function (resolve, reject) {
          Setting.findOne({code:'BUILT_INT_CONFERENCE_API'}).exec(function (err, setting) {
             if (err || !setting) 
                 reject({message:'Cannot find API URL'});
             else {
                 apiUrl = setting.valueString;
                 resolve(setting);
             }
          });
      });
  }
  
  function getApiSalt() {
      return new Promise(function (resolve, reject) {
          Setting.findOne({code:'BUILT_INT_CONFERENCE_API_SALT'}).exec(function (err, setting) {
             if (err || !setting) 
                 reject({message:'Cannot find API Salt'});
             else {
                 apiSalt = setting.valueString;
                 resolve(setting);
             }
          });
      });
  }


};

/**
 * List of Participants
 */
exports.list = function(req, res) {
  ConferenceParticipant.find().sort('-created').populate('user', 'displayName').exec(function(err, participants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(participants);
    }
  });
};

exports.participantByMember = function(req, res) {
    ConferenceParticipant.findOne({member:req.member._id}).sort('-created').populate('user', 'displayName').exec(function(err, participant) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(participant);
      }
    });
  };

exports.listByConference = function(req, res) {
    ConferenceParticipant.find({conference:req.conference._id}).sort('-created').populate('user', 'displayName').exec(function(err, participants) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(participants);
      }
    });
  };

/**
 * Participant middleware
 */
exports.participantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Participant is invalid'
    });
  }

  ConferenceParticipant.findById(id).populate('user', 'displayName').exec(function (err, participant) {
    if (err) {
      return next(err);
    } else if (!participant) {
      return res.status(404).send({
        message: 'No Participant with that identifier has been found'
      });
    }
    req.participant = participant;
    next();
  });
};
