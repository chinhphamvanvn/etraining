// Members service used to communicate Members REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CourseMembersService', CourseMembersService);

  CourseMembersService.$inject = ['$resource'];

  function CourseMembersService($resource) {
    return $resource('/api/members/:memberId', {
      memberId: '@_id'
    }, 
      {
          update: {
            method: 'PUT'
          },
          byCourse: {
            method: 'GET',
            isArray:true,
            url:'/api/members/byCourse/:courseId'
          },
          byClass: {
              method: 'GET',
              isArray:true,
              url:'/api/members/byClass/:classroomId'
            },
          byUser: {
              method: 'GET',
              isArray:true,
              url:'/api/members/byUser/:userId'
            },
            withdraw: {
                method: 'PUT',
                url:'/api/members/withdraw/:memberId'
              },
            byUserAndCourse: {
                method: 'GET',
                url:'/api/members/byUserAndCourse/:userId/:courseId'
              }
    });
  }
}());
