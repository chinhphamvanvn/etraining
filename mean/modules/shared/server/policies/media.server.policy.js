'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Media Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/media',
          permissions: '*'
        },
        {
          resources: '/api/media/byGroup/:groupId',
          permissions: ['get']
        },
        {
          resources: '/api/media/:mediumId',
          permissions: '*'
        },
        {
          resources: '/api/media/upload',
          permissions: ['post']
        },
        {
          resources: '/api/media/search',
          permissions: '*'
        }
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/api/media',
          permissions: ['get', 'post']
        },
        {
          resources: '/api/media/byGroup/:groupId',
          permissions: ['get']
        }, {
          resources: '/api/media/:mediumId',
          permissions: ['get']
        },
        {
          resources: '/api/media/upload',
          permissions: ['post']
        },
        {
          resources: '/api/media/search',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/media',
          permissions: ['get']
        },
        {
          resources: '/api/media/byGroup/:groupId',
          permissions: ['get']
        },
        {
          resources: '/api/media/:mediumId',
          permissions: ['get']
        },
        {
          resources: '/api/media/search',
          permissions: ['get']
        }
      ]
    }]);
};

/**
 * Check If Media Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Medium is being processed and the current user created it then allow any manipulation
  if (req.medium && req.user && req.medium.user && req.medium.user.id === req.user.id) {
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
