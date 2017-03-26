// Certificates service used to communicate Certificates REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CertificatesService', CertificatesService);

  CertificatesService.$inject = ['$resource'];

  function CertificatesService($resource) {
    return $resource('/api/certificates/:certificateId', {
      certificateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      grant: {
          method: 'POST'
        },
      byMember: {
          method: 'GET',
          url:'/api/certificates/byMember/:memberId',
        },
    });
  }
}());
