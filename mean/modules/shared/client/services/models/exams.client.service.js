// Exams service used to communicate Exams REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('ExamsService', ExamsService);

  ExamsService.$inject = ['$resource'];

  function ExamsService($resource) {
    return $resource('/api/exams/:examId', {
      examId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listPublished: {
          url:'/api/exams/public',
          method: 'GET',
          isArray:true
        }, 

    });
  }
}());
