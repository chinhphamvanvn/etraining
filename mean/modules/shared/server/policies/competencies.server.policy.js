'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Competencies Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/competencies',
      permissions: '*'
    }, {
      resources: '/api/competencies/:competencyId',
      permissions: '*'
    },
    {
        resources: '/api/competencies/byGroup/:groupId',
        permissions: '*'
      }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/competencies',
      permissions: ['get', 'post']
    }, {
      resources: '/api/competencies/:competencyId',
      permissions: ['get']
    },
    {
        resources: '/api/competencies/byGroup/:groupId',
        permissions: 'get'
      }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/competencies',
      permissions: ['get']
    }, {
      resources: '/api/competencies/:competencyId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Competencies Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Competency is being processed and the current user created it then allow any manipulation
  if (req.competency && req.user && req.competency.user && req.competency.user.id === req.user.id) {
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
