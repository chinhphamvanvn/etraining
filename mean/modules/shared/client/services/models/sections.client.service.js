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
    }, { byEdition: {
        method: 'GET',
        isArray:true,
        url:'/api/sections/byEdition/:editionId'
      }, 
      update: {
        method: 'PUT'
      },
      surveyByCourse: {
          url:'/api/sections/survey/:editionId',
          method: 'GET',
          isArray:true
        }, 
    });
  }
}());
