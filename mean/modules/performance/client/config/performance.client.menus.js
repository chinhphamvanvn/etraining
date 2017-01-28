(function () {
  'use strict';

  angular
    .module('performance')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.PERFORMANCE',
      state: 'admin.workspace.performance',
      roles: ['admin'],
      icon:'grade',
      position: 40
    });
  }
}());
