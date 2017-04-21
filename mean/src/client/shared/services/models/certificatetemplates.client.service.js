// Certificatetemplates service used to communicate Certificatetemplates REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('CertificateTemplatesService', CertificateTemplatesService);

  CertificateTemplatesService.$inject = ['$resource'];

  function CertificateTemplatesService($resource) {
    return $resource('/api/certificatetemplates/:certificatetemplateId', {
      certificatetemplateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
