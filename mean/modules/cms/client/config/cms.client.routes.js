(function () {
  'use strict';

  angular
    .module('cms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.workspace.cms', {
        abstract: true,
        url: '/cms',
        template: '<ui-view/>'
      })
      .state('admin.workspace.cms.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('admin.workspace.cms.courses.list', {
        url: '/list',
        templateUrl: '/modules/cms/client/views/list-courses.client.view.html',
        controller: 'CmsCoursesListController',
        controllerAs: 'vm',
        data: {
            roles: [ 'admin'],
        }
      })
      .state('admin.workspace.cms.courses.create', {
        url: '/create',
        templateUrl: '/modules/cms/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: newCourse
        },
        data: {
          roles: [ 'admin'],
        }
      })
      .state('admin.workspace.cms.courses.edit', {
        url: '/edit/:courseId',
        templateUrl: '/modules/cms/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['admin'],
        }
      })
      .state('admin.workspace.cms.courses.view', {
        url: '/view/:courseId',
        templateUrl: '/modules/cms/client/views/view-course.client.view.html',
        controller: 'CourseViewController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['admin'],
        }
      })
      .state('admin.workspace.cms.course-members', {
        url: '/members/:courseId',
        templateUrl: '/modules/cms/client/views/list-course.members.client.view.html',
        controller: 'CourseMembersController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
            roles: [ 'admin'],
        }
      })
      .state('admin.workspace.cms.categories', {
        url: '/categories',
        templateUrl: '/modules/cms/client/views/list-categories.client.view.html',
        controller: 'CourseCategoriesListController',
        controllerAs: 'vm',
        data: {
            roles: [ 'admin'],
        }
      });
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
}());
