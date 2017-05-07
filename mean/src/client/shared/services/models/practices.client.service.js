// Exercises service used to communicate Exercises REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('PracticesService', PracticesService);

  PracticesService.$inject = ['$resource', '_transform'];

  function PracticesService($resource, _transform) {
    return $resource('/api/practices/:practiceId', {
      practiceId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
    });
  }
}());
