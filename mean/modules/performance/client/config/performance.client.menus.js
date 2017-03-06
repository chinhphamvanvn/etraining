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
    menuService.addSubMenuItem('sidebar', 'admin.workspace.performance',{
        title: 'PAGE.WORKSPACE.SIDEBAR.PERFORMANCE.QUESTION_BANK',
        state: 'admin.workspace.performance.question.list',
        roles: ['admin'],
        position: 1
      });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.performance',{
        title: 'PAGE.WORKSPACE.SIDEBAR.PERFORMANCE.ASSESSMENT',
        state: 'admin.workspace.performance.schedules.list',
        roles: ['admin'],
        position: 2
      });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.performance',{
        title: 'PAGE.WORKSPACE.SIDEBAR.PERFORMANCE.COMPETENCY',
        state: 'admin.workspace.performance.competency.list',
        roles: ['admin'],
        position: 3
      });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.performance',{
        title: 'PAGE.WORKSPACE.SIDEBAR.PERFORMANCE.GAP_ANALYSIS',
        state: 'admin.workspace.performance.gap',
        roles: ['admin'],
        position: 4
      });
  }
}());
