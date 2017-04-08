'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Certificates Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/certificates',
          permissions: '*'
        },
        {
          resources: '/api/certificates/byMember/:memberId',
          permissions: '*'
        },
        {
          resources: '/api/certificates/:certificateId',
          permissions: '*'
        }
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/api/certificates',
          permissions: ['get', 'post']
        },
        {
          resources: '/api/certificates/byMember/:memberId',
          permissions: '*'
        },
        {
          resources: '/api/certificates/:certificateId',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/certificates',
          permissions: ['get']
        },
        {
          resources: '/api/certificates/:certificateId',
          permissions: ['get']
        }
      ]
    }
  ]);
};

/**
 * Check If Certificates Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Certificate is being processed and the current user created it then allow any manipulation
  if (req.certificate && req.user && req.certificate.user && req.certificate.user.id === req.user.id) {
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
