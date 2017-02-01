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
          editionResolve: getEdition,
          courseResolve: getCourse
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section', {
        abstract: true,
        url: '/:courseId/section',
        template: '<ui-view/>'
      })
      .state('workspace.lms.courses.section.view', {
        url: '/view/:sectionId',
        templateUrl: '/modules/lms/client/views/view-outline.section-course.client.view.html',
        controller: 'CoursesOutlineSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          courseResolve: getCourse
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.section.edit', {
        url: '/edit/:sectionId',
        templateUrl: '/modules/lms/client/views/form-outline.section-course.client.view.html',
        controller: 'CoursesOutlineSectionController',
        controllerAs: 'vm',
        resolve: {
          sectionResolve: getSection,
          courseResolve: getCourse
        },
        data: {
          roles: [ 'user'],
          courseRoles: [ 'teacher']
        }
      })
      .state('workspace.lms.courses.grade', {
        url: '/:courseId/:editionId/grade',
        templateUrl: '/modules/lms/client/views/grade-course.client.view.html',
        controller: 'CoursesGradeController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          schemeResolve: getGradescheme,
          editionResolve: getEdition
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
  
  getEdition.$inject = ['$stateParams', 'CourseEditionsService', '$q'];

  function getEdition($stateParams, CourseEditionsService, $q) {
      return $q(function(resolve, reject) {
          CourseEditionsService.byCourse({courseId:$stateParams.courseId},function(data) {
          if (data.length==0) {
              var edition = new CourseEditionsService();
              edition.course = $stateParams.courseId;
              edition.name ='v1.0';
              edition.$save(function() {
                  resolve(edition);
              },function(errorResponse) {
                  reject();
              });
          } else {
              resolve( data[0]);
          }
      });
      });
  }
  
  getGradescheme.$inject = ['$stateParams', 'GradeSchemesService', '$q'];

  function getGradescheme($stateParams, GradeSchemesService, $q) {
      return $q(function(resolve, reject) {
          var scheme = GradeSchemesService.byEdition({editionId:$stateParams.editionId},function(data) {
          resolve(data);
      }, function(err) {
          var scheme = new GradeSchemesService();
          scheme.edition = $stateParams.editionId;
          scheme.$save(function() {
              resolve(scheme);
          },function(errorResponse) {
              reject();
          });
      });
      });
      
  }
  
  getSection.$inject = ['$stateParams', 'EditionSectionsService'];

  function getSection($stateParams, EditionSectionsService) {
    return EditionSectionsService.get({
        sectionId: $stateParams.sectionId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
}());
