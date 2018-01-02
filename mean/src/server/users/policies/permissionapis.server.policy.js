'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Permissionobjects Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/permissionapis',
      permissions: '*'
    }, {
      resources: '/api/permissionapis/:permissionapiId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/permissionapis',
      permissions: ['get', 'post']
    }, {
      resources: '/api/permissionapis/:permissionapiId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/permissionapis',
      permissions: ['get']
    }, {
      resources: '/api/permissionapis/:permissionapiId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Permissionobjects Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Permissionobject is being processed and the current user created it then allow any manipulation
  if (req.permissionapi && req.user && req.permissionapi.user && req.permissionapi.user.id === req.user.id) {
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
