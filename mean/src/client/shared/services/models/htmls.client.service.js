// Htmls service used to communicate Htmls REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('HtmlsService', HtmlsService);

  HtmlsService.$inject = ['$resource', '_transform'];

  function HtmlsService($resource, _transform) {
    return $resource('/api/htmls/:htmlId', {
      htmlId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      }
    });
  }
}());
