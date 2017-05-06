(function(UIkit) {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserPermissionController', UserPermissionController);

  UserPermissionController.$inject = ['$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', '$timeout', '$location', '$window', 'ApiEndpointsService', 'PermissionViewsService', 'PermissionApisService', 'Notification', '$q', 'treeUtils', '$translate', '_'];

  function UserPermissionController($scope, $state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, ApiEndpointsService, PermissionViewsService, PermissionApisService, Notification, $q, treeUtils, $translate, _) {
    var vm = this;
    vm.save = save;
    vm.newPermissionView = newPermissionView;
    vm.savePermissionView = savePermissionView;
    vm.selectUserMenu = selectUserMenu;
    vm.selectAdminMenu = selectAdminMenu;
    vm.editPermissionView = editPermissionView;
    vm.deletePermissionView = deletePermissionView;
    vm.newPermissionApi = newPermissionApi;
    vm.savePermissionApi = savePermissionApi;
    vm.editPermissionApi = editPermissionApi;
    vm.deletePermissionApi = deletePermissionApi;

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
    vm.endpoints = ApiEndpointsService.query();

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
      if (user.permissionView === '')
        user.permissionView = null;
      if (user.permissionApi === '')
        user.permissionApi = null;
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

    function deletePermissionView() {
      PermissionViewsService.delete({
        permissionviewId: vm.permissionView._id
      }, function() {
        vm.permissionViewLis = _.reject(vm.permissionViewList, function(permission) {
          return permission._id === vm.permissionView._id;
        });
        vm.permissionView = new PermissionViewsService();
      });
    }

    function editPermissionView() {
      vm.permissionView = _.find(vm.permissionViewList, function(permission) {
        return permission._id === vm.permissionView._id;
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
        plugins: {
          'remove_button': {
            label: ''
          }
        },
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
      vm.permissionViewOptions.splice(0, 0, {id:0, value: '', title:'------------'});
    });

    vm.permissionApiConfig = {
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title',
      create: false
    };
    vm.permissionApiOptions = [];
    vm.permissionApiList = PermissionApisService.query(function() {
      vm.permissionApiOptions = _.map(vm.permissionApiList, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
      vm.permissionApiOptions.splice(0, 0, {id:0, value: '', title:'------------'});
    });

    function newPermissionApi() {
      vm.permissionApi = new PermissionApisService();
      _.each(vm.endpoints, function(endpoint) {
        endpoint.create = false;
        endpoint.update = false;
        endpoint.delete = false;
        endpoint.view = true;
      });
    }

    function savePermissionApi() {
      vm.permissionApi.endpoints = _.map(vm.endpoints, function(obj) {
        return {
          id: obj._id,
          create: obj.create,
          update: obj.update,
          delete: obj.delete,
          view: obj.view
        };
      });
      if (vm.permissionApi._id) {
        vm.permissionApi.$update(function() {
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
        vm.permissionApi.$save(function() {
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
      vm.permissionApiList = PermissionApisService.query(function() {
        vm.permissionApiOptions = _.map(vm.permissionApiList, function(obj) {
          return {
            id: obj._id,
            title: obj.name,
            value: obj._id
          };
        });
      });
    }

    function deletePermissionApi() {
      PermissionApisService.delete({
        permissionapiId: vm.permissionApi._id
      }, function() {
        vm.permissionApiList = _.reject(vm.permissionApiList, function(permission) {
          return permission._id === vm.permissionApi._id;
        });
        vm.permissionApi = new PermissionViewsService();
        _.each(vm.endpoints, function(endpoint) {
          endpoint.create = false;
          endpoint.update = false;
          endpoint.delete = false;
          endpoint.view = true;
        });
      });
    }

    function editPermissionApi() {
      vm.permissionApi = _.find(vm.permissionApiList, function(permission) {
        return permission._id === vm.permissionApi._id;
      });
      _.each(vm.endpoints, function(endpoint) {
        existRule = _.find(vm.permissionApi.endpoints, function(rule) {
          return rule.id === endpoint._id;
        });
        if (existRule) {
          endpoint.create = existRule.create;
          endpoint.update = existRule.update;
          endpoint.delete = existRule.delete;
          endpoint.view = existRule.view;
        }
      });
    }

  }
}(window.UIkit));
