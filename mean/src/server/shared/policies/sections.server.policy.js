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
 * Invoke Sections Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: '/api/sections',
          permissions: '*'
        },
        {
          resources: '/api/sections/byEdition/:editionId',
          permissions: '*'
        },
        {
          resources: '/api/sections/survey/:editionId',
          permissions: 'get'
        },
        {
          resources: '/api/sections/:sectionId',
          permissions: '*'
        }
      ]
    }, {
      roles: ['user'],
      allows: [
        {
          resources: '/api/sections',
          permissions: ['get', 'post']
        },
        {
          resources: '/api/sections/survey/:editionId',
          permissions: '*'
        },
        {
          resources: '/api/sections/byEdition/:editionId',
          permissions: '*'
        },
        {
          resources: '/api/sections/:sectionId',
          permissions: '*'
        }]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/sections',
          permissions: ['get']
        },
        {
          resources: '/api/sections/:sectionId',
          permissions: ['get']
        }
      ]
    }
  ]);
};

/**
 * Check If Sections Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Section is being processed and the current user created it then allow any manipulation
  if (req.section && req.user && req.section.user && req.section.user.id === req.user.id) {
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
            if (req.user && req.user.permissionApi) {
              Endpoint.findOne({
                prefix: '/api/sections'
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
