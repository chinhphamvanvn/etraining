(function() {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.USERS',
      state: 'admin.workspace.users',
      roles: ['admin'],
      icon: 'people',
      position: 100
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.users', {
      title: 'PAGE.WORKSPACE.SIDEBAR.USERS.LIST',
      state: 'admin.workspace.users.list',
      roles: ['admin'],
      position: 1
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.users', {
      title: 'PAGE.WORKSPACE.SIDEBAR.USERS.PERMISSION',
      state: 'admin.workspace.users.permission',
      roles: ['admin'],
      position: 2
    });
  }
}());
