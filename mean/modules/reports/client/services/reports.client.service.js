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
    });
  }
}());
