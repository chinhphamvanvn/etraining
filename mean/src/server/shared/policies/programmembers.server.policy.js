'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Programmembers Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/programmembers',
          permissions: '*'
        },
        {
          resources: '/api/programmembers/:programmemberId',
          permissions: '*'
        },
        {
          resources: '/api/programmembers/byProgram/:programId',
          permissions: 'get'
        },
        {
          resources: '/api/programmembers/byUserAndProgram/:userId/:programId',
          permissions: 'get'
        },
        {
          resources: '/api/programmembers/withdraw/:programmemberId',
          permissions: 'put'
        },
        {
          resources: '/api/programmembers/complete/:programmemberId/:managerId',
          permissions: 'put'
        },
        {
          resources: '/api/programmembers/byUser/:userId',
          permissions: 'get'
        }
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/api/programmembers',
          permissions: ['get', 'post']
        },
        {
          resources: '/api/programmembers/:programmemberId',
          permissions: ['get']
        },
        {
          resources: '/api/programmembers/byProgram/:programId',
          permissions: 'get'
        },
        {
          resources: '/api/programmembers/byUserAndProgram/:userId/:programId',
          permissions: 'get'
        },
        {
          resources: '/api/programmembers/withdraw/:programmemberId',
          permissions: 'put'
        },
        {
          resources: '/api/programmembers/complete/:programmemberId/:managerId',
          permissions: 'put'
        },
        {
          resources: '/api/programmembers/byUser/:userId',
          permissions: 'get'
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/programmembers',
          permissions: ['get']
        },
        {
          resources: '/api/programmembers/:programmemberId',
          permissions: ['get']
        }
      ]
    }
  ]);
};

/**
 * Check If Programmembers Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Programmember is being processed and the current user created it then allow any manipulation
  if (req.programmember && req.user && req.programmember.user && req.programmember.user.id === req.user.id) {
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
