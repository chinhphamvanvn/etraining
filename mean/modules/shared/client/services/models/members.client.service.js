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
          me: {
              method: 'GET',
              isArray:true,
              url:'/api/members/me'
            }
    });
  }
}());
