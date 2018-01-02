// Members service used to communicate Members REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseMembersService', CourseMembersService);

  CourseMembersService.$inject = ['$resource', '_transform'];

  function CourseMembersService($resource, _transform) {
    return $resource('/api/members/:memberId', {
      memberId: '@_id'
    },
      {
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
          url: '/api/members/byCourse/:courseId'
        },
        byClass: {
          method: 'GET',
          isArray: true,
          url: '/api/members/byClass/:classroomId'
        },
        byUser: {
          method: 'GET',
          isArray: true,
          url: '/api/members/byUser/:userId'
        },
        withdraw: {
          method: 'PUT',
          url: '/api/members/withdraw/:memberId',
          transformRequest: _transform.unpopulate
        },
        complete: {
          method: 'PUT',
          url: '/api/members/complete/:memberId/:teacherId',
          transformRequest: _transform.unpopulate
        },
        byUserAndCourse: {
          method: 'GET',
          url: '/api/members/byUserAndCourse/:userId/:courseId'
        }
      });
  }
}());
