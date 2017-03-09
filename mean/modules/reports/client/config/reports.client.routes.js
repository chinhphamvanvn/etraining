(function () {
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
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.reports.member-by-course', {
        url: '/member-by-course',
        templateUrl: '/modules/reports/client/views/member-by-course.reports.client.view.html',
        controller: 'MemberByCourseReportsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
    .state('admin.workspace.reports.course-by-member', {
        url: '/course-by-member',
        templateUrl: '/modules/reports/client/views/course-by-member.reports.client.view.html',
        controller: 'CourseByMemberReportsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
    .state('admin.workspace.reports.section-by-member', {
        url: '/section-by-member',
        templateUrl: '/modules/reports/client/views/section-by-member.reports.client.view.html',
        controller: 'SectionByMemberReportsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.reports.exam-result', {
        url: '/exam-result',
        templateUrl: '/modules/reports/client/views/exam-result.reports.client.view.html',
        controller: 'ExamResultReportsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      });
  }
}());
