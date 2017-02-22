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
          byUser: {
              method: 'GET',
              isArray:true,
              url:'/api/members/byUser/:userId'
            },
            withdraw: {
                method: 'POST',
                url:'/api/members/withdraw/:memberId'
              },
            byUserAndCourse: {
                method: 'GET',
                url:'/api/members/byUserAndCourse/:userId/:courseId'
              }
    });
  }
}());
