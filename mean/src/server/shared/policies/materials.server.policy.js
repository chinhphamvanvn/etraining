'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Materials Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/materials',
          permissions: '*'
        },
        {
          resources: '/api/materials/:materialId',
          permissions: '*'
        },
        {
          resources: '/api/materials/byCourse/:editionId',
          permissions: 'get'
        },
        {
          resources: '/api/materials/upload',
          permissions: ['post']
        }
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/api/materials',
          permissions: ['get', 'post']
        },
        {
          resources: '/api/materials/:materialId',
          permissions: ['get']
        },
        {
          resources: '/api/materials/byCourse/:editionId',
          permissions: 'get'
        },
        {
          resources: '/api/materials/upload',
          permissions: ['post']
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/materials',
          permissions: ['get']
        },
        {
          resources: '/api/materials/:materialId',
          permissions: ['get']
        }
      ]
    }
  ]);
};

/**
 * Check If Materials Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Material is being processed and the current user created it then allow any manipulation
  if (req.material && req.user && req.material.user && req.material.user.id === req.user.id) {
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
