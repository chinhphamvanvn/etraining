// Sections service used to communicate Sections REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('EditionSectionsService', EditionSectionsService);

  EditionSectionsService.$inject = ['$resource'];

  function EditionSectionsService($resource) {
    return $resource('/api/sections/:sectionId', {
      sectionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
