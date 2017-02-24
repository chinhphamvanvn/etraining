// Videos service used to communicate Videos REST endpoints
(function () {
  'use strict';

  angular
    .module('reports')
    .factory('ReportsService', ReportsService);

  ReportsService.$inject = ['$resource'];

  function ReportsService($resource) {
    return $resource('/api/reports',{}, {
        accountStats: {
        method: 'GET',
        url:'/api/reports/accountStats',
      },
      courseStats: {
          method: 'GET',
          url:'/api/reports/courseStats',
        },
      userRegistrationStats: {
          method: 'GET',
          isArray:true,
          url:'/api/reports/userRegistrationStats/:day',
        },
        userLoginStats: {
            method: 'GET',
            isArray:true,
            url:'/api/reports/userLoginStats/:day',
          },
          memberRegistrationStats: {
              method: 'GET',
              isArray:true,
              url:'/api/reports/memberRegistrationStats/:day',
            },
            memberInstudyStats: {
                method: 'GET',
                isArray:true,
                url:'/api/reports/memberInstudyStats/:day',
              },
              memberCompleteStats: {
                  method: 'GET',
                  isArray:true,
                  url:'/api/reports/memberCompleteStats/:day',
                },
    });
  }
}());
