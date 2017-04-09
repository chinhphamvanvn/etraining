// Editions service used to communicate Editions REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseEditionsService', CourseEditionsService);

  CourseEditionsService.$inject = ['$resource'];

  function CourseEditionsService($resource) {
    return $resource('/api/editions/:editionId', {
      editionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byCourse: {
        method: 'GET',
        url: '/api/editions/byCourse/:courseId'
      }
    });
  }
}());
