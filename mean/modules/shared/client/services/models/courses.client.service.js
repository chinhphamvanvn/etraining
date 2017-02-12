// Courses service used to communicate Courses REST endpoints
(function () {
  'use strict';

  angular
    .module('shared')
    .factory('CoursesService', CoursesService);

  CoursesService.$inject = ['$resource'];

  function CoursesService($resource) {
    return $resource('/api/courses/:courseId', {
      courseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byGroup: {
          method: 'GET',
          isArray:true,
          url:'/api/courses/byGroup/:groupId'
      },
      listPublic: {
          method: 'GET',
          isArray:true,
          url:'/api/courses/public'
      },
      listPrivate: {
          method: 'GET',
          isArray:true,
          url:'/api/courses/private'
        },
      listRestricted: {
          method: 'GET',
          isArray:true,
          url:'/api/courses/restricted'
        }
    });
  }
}());
