// Scorms service used to communicate Scorms REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('ScormsService', ScormsService);

  ScormsService.$inject = ['$resource', '_transform'];

  function ScormsService($resource, _transform) {
    return $resource('/api/scorms/:scormId', {
        scormId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      }
    });
  }
}());
