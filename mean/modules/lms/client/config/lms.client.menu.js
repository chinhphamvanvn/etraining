(function () {
  'use strict';

  angular
    .module('lms')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'PAGE.WORKSPACE.SIDEBAR.LMS.MY_COURSE',
      state: 'workspace.lms.courses.me',
      icon:'school',
      position: 20,
      roles: ['user']
    });
    menuService.addMenuItem('sidebar', {
        title: 'PAGE.WORKSPACE.SIDEBAR.LMS.MY_EXAM',
        state: 'workspace.lms.exams.me',
        icon:'alarm_add',
        position: 25,
        roles: ['user']
      });
    menuService.addMenuItem('sidebar', {
        title: 'PAGE.WORKSPACE.SIDEBAR.LMS.MY_PROGRAM',
        state: 'workspace.lms.programs.me',
        icon:'alarm_add',
        position: 28,
        roles: ['user']
      });
    menuService.addMenuItem('sidebar', {
        title: 'PAGE.WORKSPACE.SIDEBAR.LMS.COURSE_LIST',
        state: 'workspace.lms.courses.list',
        icon:'search',
        position: 30,
        roles: ['user']
      });
  }
}());
