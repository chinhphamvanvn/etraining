// Editions service used to communicate Editions REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseEditionsService', CourseEditionsService);

  CourseEditionsService.$inject = ['$resource', '_transform'];

  function CourseEditionsService($resource, _transform) {
    return $resource('/api/editions/:editionId', {
      editionId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byCourse: {
        method: 'GET',
        url: '/api/editions/byCourse/:courseId'
      }
    });
  }
}());
