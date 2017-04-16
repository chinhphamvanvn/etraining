(function(UIkit) {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserPermissionController', UserPermissionController);

  UserPermissionController.$inject = ['$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', '$timeout', '$location', '$window', 'PermissionViewsService', 'Notification', '$q', 'treeUtils', '$translate', '_'];

  function UserPermissionController($scope, $state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, PermissionViewsService, Notification, $q, treeUtils, $translate, _) {
    var vm = this;
    vm.save = save;
    vm.newPermissionView = newPermissionView;
    vm.savePermissionView = savePermissionView;
    vm.selectUserMenu = selectUserMenu;
    vm.selectAdminMenu = selectAdminMenu;

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

    function newPermissionView() {
      vm.permissionView = new PermissionViewsService();
    }

    function selectUserMenu(menuIds) {
      vm.permissionView.userMenu = menuIds;
    }

    function selectAdminMenu(menuIds) {
      vm.permissionView.adminMenu = menuIds;
    }

    function save(user) {
      user.$update(function() {
        Notification.success({
          message: '<i class="uk-icon-check"></i> User saved successfully!'
        });
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> User update error!'
        });
      });
    }

    function savePermissionView() {
      if (vm.permissionView._id) {
        vm.permissionView.$update(function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Permission saved successfully!'
          });
        }, function(errorResponse) {
          Notification.error({
            message: errorResponse.data.message,
            title: '<i class="uk-icon-ban"></i> Permission update error!'
          });
        });
      } else {
        vm.permissionView.$save(function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Permission saved successfully!'
          });
        }, function(errorResponse) {
          Notification.error({
            message: errorResponse.data.message,
            title: '<i class="uk-icon-ban"></i> Permission update error!'
          });
        });
      }
      vm.permissionViewList = PermissionViewsService.query(function() {
        vm.permissionViewOptions = _.map(vm.permissionViewList, function(obj) {
          return {
            id: obj._id,
            title: obj.name,
            value: obj._id
          };
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
    vm.permissionViewList = PermissionViewsService.query(function() {
      vm.permissionViewOptions = _.map(vm.permissionViewList, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
    });

  }
}(window.UIkit));
