(function() {
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
          roles: ['admin']
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
          roles: ['admin']
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
          roles: ['admin']
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
          roles: ['admin']
        }
      })
      .state('admin.workspace.cms.course-members', {
        url: '/members/:courseId',
        templateUrl: '/modules/cms/client/views/list-course.members.client.view.html',
        controller: 'CourseMembersController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          editionResolve: getEdition
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.cms.programs', {
        abstract: true,
        url: '/programs',
        template: '<ui-view/>'
      })
      .state('admin.workspace.cms.programs.list', {
        url: '/list',
        templateUrl: '/modules/cms/client/views/list-programs.client.view.html',
        controller: 'CmsProgramsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.cms.programs.create', {
        url: '/create',
        templateUrl: '/modules/cms/client/views/form-program.client.view.html',
        controller: 'ProgramsController',
        controllerAs: 'vm',
        resolve: {
          programResolve: newProgram
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.cms.programs.edit', {
        url: '/edit/:programId',
        templateUrl: '/modules/cms/client/views/form-program.client.view.html',
        controller: 'ProgramsController',
        controllerAs: 'vm',
        resolve: {
          programResolve: getProgram
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.cms.programs.view', {
        url: '/view/:programId',
        templateUrl: '/modules/cms/client/views/view-program.client.view.html',
        controller: 'ProgramViewController',
        controllerAs: 'vm',
        resolve: {
          programResolve: getProgram
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.cms.program-members', {
        url: '/program-members/:programId',
        templateUrl: '/modules/cms/client/views/list-program.members.client.view.html',
        controller: 'ProgramMembersController',
        controllerAs: 'vm',
        resolve: {
          programResolve: getProgram
        },
        data: {
          roles: ['admin']
        }
      });
  }

  getEdition.$inject = ['$stateParams', 'CourseEditionsService'];

  function getEdition($stateParams, CourseEditionsService) {
    if ($stateParams.editionId)
      return CourseEditionsService.get({
        editionId: $stateParams.editionId
      }).$promise;
    return CourseEditionsService.byCourse({
      courseId: $stateParams.courseId
    }).$promise;
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

  newProgram.$inject = ['CourseProgramsService'];

  function newProgram(CourseProgramsService) {
    return new CourseProgramsService();
  }

  getProgram.$inject = ['$stateParams', 'CourseProgramsService'];

  function getProgram($stateParams, CourseProgramsService) {
    return CourseProgramsService.get({
      programId: $stateParams.programId
    }).$promise;
  }
}());
