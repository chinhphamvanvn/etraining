(function() {
  'use strict';

  // Setting up route
  angular
    .module('reports.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.reports', {
        url: '/reports',
        abstract: true,
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.reports.member-by-course', {
        url: '/member-by-course',
        templateUrl: '/src/client/reports/views/member-by-course.reports.client.view.html',
        controller: 'MemberByCourseReportsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.reports.course-by-member', {
        url: '/course-by-member',
        templateUrl: '/src/client/reports/views/course-by-member.reports.client.view.html',
        controller: 'CourseByMemberReportsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.reports.section-by-member', {
        url: '/section-by-member',
        templateUrl: '/src/client/reports/views/section-by-member.reports.client.view.html',
        controller: 'SectionByMemberReportsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.reports.exam-result', {
        url: '/exam-result',
        templateUrl: '/src/client/reports/views/exam-result.reports.client.view.html',
        controller: 'ExamResultReportsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      });
  }
}());
