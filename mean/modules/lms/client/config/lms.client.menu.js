(function () {
  'use strict';

  angular
    .module('lms')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.MY_COURSE',
      state: 'workspace.lms.courses.list',
      icon:'school',
      position: 20,
      roles: ['user']
    });
  }
}());
