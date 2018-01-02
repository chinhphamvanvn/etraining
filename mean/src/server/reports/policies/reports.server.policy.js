'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Report Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/reports/accountStats',
          permissions: '*'
        },
        {
          resources: '/api/reports/courseStats',
          permissions: '*'
        },
        {
          resources: '/api/reports/userRegistrationStats/:day',
          permissions: '*'
        },
        {
          resources: '/api/reports/userLoginStats/:day',
          permissions: '*'
        },
        {
          resources: '/api/reports/memberRegistrationStats/:day',
          permissions: '*'
        },
        {
          resources: '/api/reports/memberInstudyStats/:day',
          permissions: '*'
        },
        {
          resources: '/api/reports/memberCompleteStats/:day',
          permissions: '*'
        },
        {
          resources: '/api/reports/courseAttemptStats/:day/:editionId',
          permissions: '*'
        },
        {
          resources: '/api/reports/memberAttemptStats/:memberId/:editionId',
          permissions: 'get'
        }
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/api/reports/courseAttemptStats/:day/:editionId',
          permissions: 'get'
        },
        {
          resources: '/api/reports/memberAttemptStats/:memberId/:editionId',
          permissions: 'get'
        }
      ]
    }
  ]);
};

/**
 * Check If Report Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Video is being processed and the current user created it then allow any manipulation
  if (req.video && req.user && req.video.user && req.video.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
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
