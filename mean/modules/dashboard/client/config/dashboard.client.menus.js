(function () {
  'use strict';

  angular
    .module('dashboard')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.DASHBOARD',
      state: 'admin.workspace.dashboard',
      roles: ['admin'],
      icon:'dashboard',
      position: 1
  });
  }
}());
