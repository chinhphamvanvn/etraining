(function () {
  'use strict';

  angular
    .module('cms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('workspace.lms', {
        abstract: true,
        url: '/lms',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.list', {
        url: '/list',
        templateUrl: '/modules/lms/client/views/list-courses.client.view.html',
        controller: 'MyCoursesListController',
        controllerAs: 'vm',
        data: {
            roles: [ 'user'],
            courseRoles: [ 'teacher','student']
        }
      })
      .state('workspace.lms.courses.outline', {
        url: '/outline/:courseId',
        templateUrl: '/modules/lms/client/views/outline-course.client.view.html',
        controller: 'CoursesOutlineController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.outline.section', {
        url: '/:sectionId',
        templateUrl: '/modules/lms/client/views/section-outline-course.client.view.html',
        controller: 'CoursesOutlineSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.grade', {
        url: '/:courseId/grade',
        templateUrl: '/modules/lms/client/views/grade-course.client.view.html',
        controller: 'CoursesGradeController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.study', {
        url: '/:courseId/study',
        templateUrl: '/modules/lms/client/views/study-course.client.view.html',
        controller: 'CoursesStudyController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['user'],
          courseRoles: [ 'student']
        }
      })
      .state('workspace.lms.courses.gradebooks', {
        url: '/:courseId/gradebooks',
        templateUrl: '/modules/lms/client/views/list-gradebook-course.client.view.html',
        controller: 'CourseGradebooksListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.gradebooks.view', {
        url: '/:courseId/gradebooks/:gradebookId',
        templateUrl: '/modules/lms/client/views/view-gradebook-course.client.view.html',
        controller: 'CourseGradebooksController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: [ 'student']
        }
      });
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }
  
  getSection.$inject = ['$stateParams', 'EditionSectionService'];

  function getCourse($stateParams, EditionSectionService) {
    return EditionSectionService.get({
        sectionId: $stateParams.sectionId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
}());
