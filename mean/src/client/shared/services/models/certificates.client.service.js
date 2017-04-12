// Certificates service used to communicate Certificates REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CertificatesService', CertificatesService);

  CertificatesService.$inject = ['$resource', '_transform'];

  function CertificatesService($resource, _transform) {
    return $resource('/api/certificates/:certificateId', {
      certificateId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      grant: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byMember: {
        method: 'GET',
        url: '/api/certificates/byMember/:memberId'
      }
    });
  }
}());
