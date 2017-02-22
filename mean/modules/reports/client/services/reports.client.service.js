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
    });
  }
}());
