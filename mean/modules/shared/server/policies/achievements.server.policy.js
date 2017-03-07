'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Achievements Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/achievements',
      permissions: '*'
    }, {
      resources: '/api/achievements/:achievementId',
      permissions: '*'
    },
    {
        resources: '/api/achievements/byUser/:achiever',
        permissions: '*'
      },
    , {
        resources: '/api/achievements/byUserAndCompetency/:achiever/:competencyId',
        permissions: '*'
      }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/achievements',
      permissions: ['get', 'post']
    }, {
      resources: '/api/achievements/:achievementId',
      permissions: ['get']
    },
    {
        resources: '/api/achievements/byUser/:achiever',
        permissions: 'get'
      },
    , {
        resources: '/api/achievements/byUserAndCompetency/:achiever/:competencyId',
        permissions: 'get'
      }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/achievements',
      permissions: ['get']
    }, {
      resources: '/api/achievements/:achievementId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Achievements Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Achievement is being processed and the current user created it then allow any manipulation
  if (req.achievement && req.user && req.achievement.user && req.achievement.user.id === req.user.id) {
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
