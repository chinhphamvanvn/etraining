(function() {
  'use strict';

  angular
    .module('settings')
    .controller('SystemSettingsController', SystemSettingsController);

  SystemSettingsController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'SettingsService', 'GroupsService', '$window', '$q', '_'];

  function SystemSettingsController($scope, $rootScope, $state, Authentication, SettingsService, GroupsService, $window, $q, _) {
    var vm = this;
    vm.groupConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };
    vm.groupOptions = [];

    vm.groups = GroupsService.byCategory({
      category: 'organization'
    }, function() {
      vm.groupOptions = _.map(vm.groups, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
    });

    vm.settings = SettingsService.query(function() {
      vm.settingContactEmail = _.find(vm.settings, function(setting) {
        return setting.code === 'CONTACT_EMAIL';
      });
      vm.settingRegisterMode = _.find(vm.settings, function(setting) {
        return setting.code === 'REGISTER_MODE';
      });
      vm.settingRegisterGroup = _.find(vm.settings, function(setting) {
        return setting.code === 'REGISTER_GROUP';
      });
      vm.settingApiPermissionEnable = _.find(vm.settings, function(setting) {
        return setting.code === 'API_PERMISSION_ENABLE';
      });
      vm.settingBuiltinConferenceApiURL = _.find(vm.settings, function(setting) {
        return setting.code === 'BUILT_INT_CONFERENCE_API';
      });
      vm.settingBuiltinConferenceApiSalt = _.find(vm.settings, function(setting) {
        return setting.code === 'BUILT_INT_CONFERENCE_API_SALT';
      });
      vm.settingBuiltinConferenceRoomURL = _.find(vm.settings, function(setting) {
        return setting.code === 'BUILT_INT_CONFERENCE_ROOM_URL';
      });
    });
    vm.saveSetting = saveSetting;

    function saveSetting() {
      var allPromise = [];
      _.each(vm.settings, function(setting) {
        allPromise.push(setting.$update().$promise);
      });

      $q.all(allPromise).then(function(response) {
        Notification.success({
          message: '<i class="uk-icon-check"></i> Setting saved successfully!'
        });
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Setting update error!'
        });
      });
    }

  }
}());
