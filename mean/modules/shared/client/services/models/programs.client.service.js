// Programs service used to communicate Programs REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('ProgramsService', ProgramsService);

  ProgramsService.$inject = ['$resource'];

  function ProgramsService($resource) {
    return $resource('/api/programs/:programId', {
      programId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
