(function() {
  'use strict';

  angular
    .module('library')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.LIBRARY',
      state: 'admin.workspace.library.content.list',
      roles: ['admin'],
      icon: 'local_library',
      position: 90
    });
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.LIBRARY',
      state: 'workspace.library',
      roles: ['user'],
      icon: 'local_library',
      position: 90
    });
  }
}());
