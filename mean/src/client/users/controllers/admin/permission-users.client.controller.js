(function(UIkit) {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserPermissionController', UserPermissionController);

  UserPermissionController.$inject = ['$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', '$timeout', '$location', '$window', 'PermissionViewsService', 'Notification', '$q', 'treeUtils', '$translate', '_'];

  function UserPermissionController($scope, $state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, PermissionViewsService, Notification, $q, treeUtils, $translate, _) {
    var vm = this;
    vm.save = save;

    vm.selectGroup = function(groups) {
      vm.users = [];
      _.each(groups, function(group) {
        AdminService.byGroup({
          groupId: group
        }, function(users) {
          vm.users = vm.users.concat(users);
        });
      });
    };
    
    function save(user) {
        user.$update(function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> User saved successfully!'
          });
        }, function() {
          Notification.error({
            message: errorResponse.data.message,
            title: '<i class="uk-icon-ban"></i> User update error!'
          });
        });
    }
    
    vm.roleSwitcherOptions = [
      {
        id: 1,
        title: 'User',
        value: 'user'
      },
      {
        id: 2,
        title: 'Admin',
        value: 'admin'
      }
    ];
    vm.roleSwitcherConfig = {
      plugins: {
        'remove_button': {
          label: ''
        }
      },
      maxItems: null,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title',
      create: false
    };
    
    vm.permissionViewConfig = {
        maxItems: 1,
        valueField: 'value',
        labelField: 'title',
        searchField: 'title',
        create: false
      };
      vm.permissionViewOptions = [];
      PermissionViewsService.query(function(permissions) {
        vm.permissionViewOptions = _.map(permissions, function(obj) {
          return {
            id: obj._id,
            title: obj.name,
            value: obj._id
          };
        });
      });

  }
}(window.UIkit));
