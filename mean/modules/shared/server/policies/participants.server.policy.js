'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Participants Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/participants',
      permissions: '*'
    }, {
      resources: '/api/participants/:participantId',
      permissions: '*'
    },
    {
        resources: '/api/participants/byMember/:memberId',
        permissions: '*'
      },
    {
        resources: '/api/participants/byConference/:conferenceId',
        permissions: '*'
      }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/participants',
      permissions: ['get', 'post']
    }, {
      resources: '/api/participants/:participantId',
      permissions: ['get']
    },
    {
        resources: '/api/participants/byMember/:memberId',
        permissions: 'get'
      },
    {
        resources: '/api/participants/byConference/:conferenceId',
        permissions: 'get'
      }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/participants',
      permissions: ['get']
    }, {
      resources: '/api/participants/:participantId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Participants Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Participant is being processed and the current user created it then allow any manipulation
  if (req.participant && req.user && req.participant.user && req.participant.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
