(function () {
  'use strict';

  angular
    .module('reports')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.REPORTS',
      state: 'admin.workspace.reports',
      roles: ['admin'],
      icon:'insert_chart',
      position: 60
    });
  }
}());
