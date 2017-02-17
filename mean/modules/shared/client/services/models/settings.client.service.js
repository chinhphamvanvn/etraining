// Settings service used to communicate Settings REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('SettingsService', SettingsService);

  SettingsService.$inject = ['$resource'];

  function SettingsService($resource) {
    return $resource('/api/settings/:settingId', {
      settingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      registerMode: {
          method: 'GET',
          url:'/api/settings/byCode/:code',
          params:{code:'REGISTER_MODE'}
        },
        contactEmail: {
            method: 'GET',
            url:'/api/settings/byCode/:code',
            params:{code:'CONTACT_EMAIL'}
          },
          maxLoginAttempt: {
              method: 'GET',
              url:'/api/settings/byCode/:code',
              params:{code:'MAX_LOGIN_ATTEMPT'}
            },
            concurrentLogin: {
                method: 'GET',
                url:'/api/settings/byCode/:code',
                params:{code:'CONCURRENT_LOGIN'}
              },  
              vietInterviewConferenceApiUrl: {
                  method: 'GET',
                  url:'/api/settings/byCode/:code',
                  params:{code:'BUILT_IN_CONFERENCE_API'}
                },  
                vietInterviewConferenceApiSalt: {
                    method: 'GET',
                    url:'/api/settings/byCode/:code',
                    params:{code:'BUILT_IN_CONFERENCE_API_SALT'}
                  }
    });
  }
}());
