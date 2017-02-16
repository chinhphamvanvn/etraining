'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Editions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/editions',
      permissions: '*'
    }, 
      {
        resources: '/api/editions/byCourse:courseId',
        permissions: '*'
      },{
      resources: '/api/editions/:editionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/editions',
      permissions: ['get', 'post']
    }, {
        resources: '/api/editions/byCourse/:courseId',
        permissions: ['get']
      },
      {
      resources: '/api/editions/:editionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/editions',
      permissions: ['get']
    }, {
        resources: '/api/editions/byCourse/:courseId',
        permissions: ['get']
      }, {
      resources: '/api/editions/:editionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Editions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Edition is being processed and the current user created it then allow any manipulation
  if (req.edition && req.user && req.edition.user && req.edition.user.id === req.user.id) {
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
