// Settings service used to communicate Settings REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('SettingsService', SettingsService);

  SettingsService.$inject = ['$resource', '_transform'];

  function SettingsService($resource, _transform) {
    var Settings = $resource('/api/settings/:settingId', {
      settingId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byCode: {
        method: 'GET',
        url: '/api/settings/byCode/:code'
      }
    });

    angular.extend(Settings, {
      registerMode: function() {
        return this.byCode({
          code: 'REGISTER_MODE'
        }).$promise;
      },
      contactEmail: function() {
        return this.byCode({
          code: 'CONTACT_EMAIL'
        }).$promise;
      },
      maxLoginAttempt: function() {
        return this.byCode({
          code: 'MAX_LOGIN_ATTEMPT'
        }).$promise;
      },
      concurrentLogin: function() {
        return this.byCode({
          code: 'CONCURRENT_LOGIN'
        }).$promise;
      },
      vietInterviewConferenceApiUrl: function() {
        return this.byCode({
          code: 'BUILT_IN_CONFERENCE_API'
        }).$promise;
      },
      vietInterviewConferenceApiSalt: function() {
        return this.byCode({
          code: 'BUILT_IN_CONFERENCE_API_SALT'
        }).$promise;
      }
    });

    return Settings;
  }
}());
