(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.USERS',
      state: 'admin.workspace.users.list',
      roles: ['admin'],
      icon:'people',
      position: 100
    });
  }
}());
