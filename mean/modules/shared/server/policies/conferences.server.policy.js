'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Conferences Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/conferences',
      permissions: '*'
    }, {
      resources: '/api/conferences/:conferenceId',
      permissions: '*'
    },
    {
        resources: '/api/conferences/byClass/:classroomId',
        permissions: '*'
      }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/conferences',
      permissions: ['get', 'post']
    }, {
      resources: '/api/conferences/:conferenceId',
      permissions: ['get']
    },
    {
        resources: '/api/conferences/byClass/:classroomId',
        permissions: 'get'
      }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/conferences',
      permissions: ['get']
    }, {
      resources: '/api/conferences/:conferenceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Conferences Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Conference is being processed and the current user created it then allow any manipulation
  if (req.conference && req.user && req.conference.user && req.conference.user.id === req.user.id) {
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
