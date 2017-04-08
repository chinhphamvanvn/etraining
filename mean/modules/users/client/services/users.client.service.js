(function() {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      me: {
        method: 'GET',
        url: '/api/users/me'
      },
      logs: {
        method: 'GET',
        url: '/api/users/logs',
        isArray: true
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(Users, {
      changePassword: function(passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      removeSocialAccount: function(provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function(credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function(token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function(credentials) {
        return this.signup(credentials).$promise;
      },
      userSignin: function(credentials) {
        return this.signin(credentials).$promise;
      }
    });

    return Users;
  }

  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@_id'
    },
      {
        byGroup: {
          method: 'GET',
          url: '/api/users/group/:groupId',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        bulkCreate: {
          method: 'POST',
          url: '/api/users/bulk/:users'
        }
      });
  }

  angular
    .module('logs.services')
    .factory('UserLogsService', UserLogsService);

  UserLogsService.$inject = ['$resource'];

  function UserLogsService($resource) {
    return $resource('/api/logs/:userId', {
      userId: '@_id'
    },
      {
        userLogs: {
          method: 'GET',
          url: '/api/users/logs',
          isArray: true
        },
        userLogsByAdmin: {
          method: 'GET',
          url: '/api/logs/:userId',
          isArray: true
        }
      });
  }
}());
