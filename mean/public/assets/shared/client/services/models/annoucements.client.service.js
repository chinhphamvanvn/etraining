// Annoucements service used to communicate Annoucements REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('AnnoucementsService', AnnoucementsService);

  AnnoucementsService.$inject = ['$resource'];

  function AnnoucementsService($resource) {
    return $resource('/api/annoucements/:annoucementId', {
      annoucementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listPublished: {
          url:'/api/annoucements/public',
          method: 'GET',
          isArray:true
        }, 
    });
  }
}());
