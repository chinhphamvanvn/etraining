// Courses service used to communicate Courses REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CoursesService', CoursesService);

  CoursesService.$inject = ['$resource', '_transform'];

  function CoursesService($resource, _transform) {
    return $resource('/api/courses/:courseId', {
      courseId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byGroup: {
        method: 'GET',
        isArray: true,
        url: '/api/courses/byGroup/:groupId'
      },
      listPublic: {
        method: 'GET',
        isArray: true,
        url: '/api/courses/public'
      },
      listPrivate: {
        method: 'GET',
        isArray: true,
        url: '/api/courses/private'
      },
      listRestricted: {
        method: 'GET',
        isArray: true,
        url: '/api/courses/restricted'
      },
      listByKeyword: {
        url: '/api/courses/search',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
