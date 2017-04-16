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
      resources: '/api/permissionobjects',
      permissions: '*'
    }, {
      resources: '/api/permissionobjects/:permissionobjectId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/permissionobjects',
      permissions: ['get', 'post']
    }, {
      resources: '/api/permissionobjects/:permissionobjectId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/permissionobjects',
      permissions: ['get']
    }, {
      resources: '/api/permissionobjects/:permissionobjectId',
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
  if (req.permissionobject && req.user && req.permissionobject.user && req.permissionobject.user.id === req.user.id) {
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
