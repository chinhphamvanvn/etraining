(function () {
  'use strict';

  angular
    .module('assessment')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.ASSESSMENT',
      state: 'admin.workspace.assessment',
      roles: ['admin'],
      icon:'thumbs_up_down',
      position: 40
    });
  }
}());
