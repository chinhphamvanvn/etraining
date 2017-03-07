'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Answers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/answers',
      permissions: '*'
    },{
        resources: '/api/answers/byAttempt/:attemptId',
        permissions: '*'
      }, {
      resources: '/api/answers/:answerId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/answers',
      permissions: ['get', 'post']
    }, {
        resources: '/api/answers/byAttempt/:attemptId',
        permissions: ['get','put']
      },{
      resources: '/api/answers/:answerId',
      permissions: ['get','put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/answers',
      permissions: ['get']
    }, {
      resources: '/api/answers/:answerId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Answers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Answer is being processed and the current user created it then allow any manipulation
  if (req.answer && req.user && req.answer.user && req.answer.user.id === req.user.id) {
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
