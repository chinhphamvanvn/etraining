'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Sections Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sections',
      permissions: '*'
    }, {
        resources: '/api/sections/byEdition/:editionId',
        permissions: '*'
      },{
      resources: '/api/sections/:sectionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/sections',
      permissions: ['get', 'post']
    }, {
        resources: '/api/sections/byEdition/:editionId',
        permissions: '*'
      },{
      resources: '/api/sections/:sectionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/sections',
      permissions: ['get']
    }, {
      resources: '/api/sections/:sectionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Sections Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Section is being processed and the current user created it then allow any manipulation
  if (req.section && req.user && req.section.user && req.section.user.id === req.user.id) {
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
