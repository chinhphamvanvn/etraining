(function() {
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
      icon: 'insert_chart',
      position: 60
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.reports', {
      title: 'PAGE.WORKSPACE.SIDEBAR.REPORTS.MEMBER_BY_COURSE',
      state: 'admin.workspace.reports.member-by-course',
      roles: ['admin'],
      position: 1
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.reports', {
      title: 'PAGE.WORKSPACE.SIDEBAR.REPORTS.SECTION_BY_MEMBER',
      state: 'admin.workspace.reports.section-by-member',
      roles: ['admin'],
      position: 3
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.reports', {
      title: 'PAGE.WORKSPACE.SIDEBAR.REPORTS.COURSE_BY_MEMBER',
      state: 'admin.workspace.reports.course-by-member',
      roles: ['admin'],
      position: 2
    });
    menuService.addSubMenuItem('sidebar', 'admin.workspace.reports', {
      title: 'PAGE.WORKSPACE.SIDEBAR.REPORTS.EXAM_RESULT',
      state: 'admin.workspace.reports.exam-result',
      roles: ['admin'],
      position: 4
    });
  }
}());
