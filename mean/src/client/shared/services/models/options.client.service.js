// Options service used to communicate Options REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('OptionsService', OptionsService);

  OptionsService.$inject = ['$resource', '_transform'];

  function OptionsService($resource, _transform) {
    return $resource('/api/options/:optionId', {
      optionId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byQuestion: {
        method: 'GET',
        url: '/api/options/byQuestion/:questionId',
        isArray: true
      }
    });
  }
}());
