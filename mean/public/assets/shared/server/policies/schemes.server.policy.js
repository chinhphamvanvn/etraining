'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Schemes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/schemes',
      permissions: '*'
    }, {
        resources: '/api/schemes/byEdition/:editionId',
        permissions: '*'
      }, {
      resources: '/api/schemes/:schemeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/schemes',
      permissions: ['get', 'post']
    }, {
        resources: '/api/schemes/byEdition/:editionId',
        permissions: '*'
      },{
      resources: '/api/schemes/:schemeId',
      permissions: ['get','put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/schemes',
      permissions: []
    }, {
      resources: '/api/schemes/:schemeId',
      permissions: []
    }]
  }]);
};

/**
 * Check If Schemes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Scheme is being processed and the current user created it then allow any manipulation
  if (req.scheme && req.user && req.scheme.user && req.scheme.user.id === req.user.id) {
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
