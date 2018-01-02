// Annoucements service used to communicate Annoucements REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('AnnoucementsService', AnnoucementsService);

  AnnoucementsService.$inject = ['$resource', '_transform'];

  function AnnoucementsService($resource, _transform) {
    return $resource('/api/annoucements/:annoucementId', {
      annoucementId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      listPublished: {
        url: '/api/annoucements/public',
        method: 'GET',
        isArray: true
      },
      distribute: {
        url: '/api/annoucements/distribute/:annoucementId/:users',
        method: 'POST',
        transformRequest: _transform.unpopulate
      }
    });
  }
}());
