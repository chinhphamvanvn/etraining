// Classrooms service used to communicate Classrooms REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ClassroomsService', ClassroomsService);

  ClassroomsService.$inject = ['$resource'];

  function ClassroomsService($resource) {
    return $resource('/api/classrooms/:classroomId', {
      classroomId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      byCourse: {
        method: 'GET',
        isArray: true,
        url: '/api/classrooms/byCourse/:courseId'
      }
    });
  }
}());
