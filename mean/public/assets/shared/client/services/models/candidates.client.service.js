// Candidates service used to communicate Candidates REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CandidatesService', CandidatesService);

  CandidatesService.$inject = ['$resource'];

  function CandidatesService($resource) {
    return $resource('/api/candidates/:candidateId', {
      candidateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
