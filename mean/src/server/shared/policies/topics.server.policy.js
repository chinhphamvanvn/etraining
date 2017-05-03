'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
  mongoose = require('mongoose'),
  PermissionApi = mongoose.model('PermissionApi'),
  Endpoint = mongoose.model('Endpoint'),
  _ = require('lodash'),
  Setting = mongoose.model('Setting');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Topics Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/topics',
      permissions: '*'
    }, {
      resources: '/api/topics/:topicId',
      permissions: '*'
    }, {
      resources: '/api/topics/byForum/:forumId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/topics',
      permissions: ['get', 'post']
    }, {
      resources: '/api/topics/:topicId',
      permissions: ['get']
    }, {
      resources: '/api/topics/byForum/:forumId',
      permissions: 'get'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/topics',
      permissions: ['get']
    }, {
      resources: '/api/topics/:topicId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Topics Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Topic is being processed and the current user created it then allow any manipulation
  if (req.topic && req.user && req.topic.user && req.topic.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        Setting.findOne({
          code: 'API_PERMISSION_ENABLE'
        }, function(err, setting) {
          if (err || !setting) {
            return res.status(403).json({
              message: 'User is not authorized'
            });
          }
          if (setting.valueBoolean) {
            if (req.user.permissionApi) {
              Endpoint.findOne({
                prefix: '/api/topics'
              }, function(err, endpointRecord) {
                if (err || !endpointRecord) {
                  return next();
                } else {
                  PermissionApi.findById(req.user.permissionApi).exec(function(err, permissionApi) {
                    var endpoint = _.find(permissionApi.endpoints, { id: endpointRecord._id });

                    console.log(endpoint, req.method);
                    if (endpoint) {
                      if (endpoint.create && req.method.toLowerCase() === 'post')
                        return next();
                      else if (endpoint.update && req.method.toLowerCase() === 'put')
                        return next();
                      else if (endpoint.delete && req.method.toLowerCase() === 'delete')
                        return next();
                      else if (endpoint.view && req.method.toLowerCase() === 'get')
                        return next();
                      else
                        return res.status(400).json({
                          message: 'Permission denied'
                        });
                    } else
                      return next();
                  });
                }
              });
            } else
              return next();
          } else
            return next();
        });
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
