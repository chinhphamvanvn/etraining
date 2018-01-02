// Sections service used to communicate Sections REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('EditionSectionsService', EditionSectionsService);

  EditionSectionsService.$inject = ['$resource', '_transform'];

  function EditionSectionsService($resource, _transform) {
    return $resource('/api/sections/:sectionId', {
      sectionId: '@_id'
    }, {
      byEdition: {
        method: 'GET',
        isArray: true,
        url: '/api/sections/byEdition/:editionId'
      },
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      surveyByCourse: {
        url: '/api/sections/survey/:editionId',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
