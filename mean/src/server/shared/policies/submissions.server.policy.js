'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Submissions Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/submissions',
          permissions: '*'
        }, {
          resources: '/api/submissions/:submissionId',
          permissions: '*'
        },
        {
          resources: '/api/submissions/byCandidate/:candidateId',
          permissions: '*'
        },
        {
          resources: '/api/submissions/byExam/:examId',
          permissions: '*'
        },
        {
          resources: '/api/submissions/byExamAndCandidate/:examId/:candidateId',
          permissions: '*'
        }
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/api/submissions',
          permissions: ['get', 'post']
        }, {
          resources: '/api/submissions/:submissionId',
          permissions: ['get']
        },
        {
          resources: '/api/submissions/byCandidate/:candidateId',
          permissions: '*'
        },
        {
          resources: '/api/submissions/byExam/:examId',
          permissions: 'get'
        },
        {
          resources: '/api/submissions/byExamAndCandidate/:examId/:candidateId',
          permissions: 'get'
        }
      ]
    },
    {
      roles: ['guest'],
      allows: []
    }
  ]);
};

/**
 * Check If Submissions Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Submission is being processed and the current user created it then allow any manipulation
  if (req.submission && req.user && req.submission.user && req.submission.user.id === req.user.id) {
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