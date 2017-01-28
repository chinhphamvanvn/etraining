// Units service used to communicate Units REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('EditionUnitsService', EditionUnitsService);

  EditionUnitsService.$inject = ['$resource'];

  function EditionUnitsService($resource) {
    return $resource('/api/units/:unitId', {
      unitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
