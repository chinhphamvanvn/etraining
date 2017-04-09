(function() {
  'use strict';

  angular
    .module('settings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.SETTINGS',
      state: 'admin.workspace.settings',
      roles: ['admin'],
      icon: 'settings',
      position: 110
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.settings', {
      title: 'PAGE.WORKSPACE.SIDEBAR.SETTINGS.SYSTEM',
      state: 'admin.workspace.settings.system',
      roles: ['admin'],
      position: 1
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.settings', {
      title: 'PAGE.WORKSPACE.SIDEBAR.SETTINGS.ALERT',
      state: 'admin.workspace.settings.alert',
      roles: ['admin'],
      position: 2
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.settings', {
      title: 'PAGE.WORKSPACE.SIDEBAR.SETTINGS.BULLETIN',
      state: 'admin.workspace.settings.annoucements.list',
      roles: ['admin'],
      icon: 'blur_linear',
      position: 3
    });
  }
}());
