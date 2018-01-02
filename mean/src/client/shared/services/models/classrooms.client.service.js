// Classrooms service used to communicate Classrooms REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ClassroomsService', ClassroomsService);

  ClassroomsService.$inject = ['$resource', '_transform'];

  function ClassroomsService($resource, _transform) {
    return $resource('/api/classrooms/:classroomId', {
      classroomId: '@_id'
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
        isArray: true,
        url: '/api/classrooms/byCourse/:courseId'
      }
    });
  }
}());
