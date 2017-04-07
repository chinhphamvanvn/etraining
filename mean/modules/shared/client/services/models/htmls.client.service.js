// Htmls service used to communicate Htmls REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('HtmlsService', HtmlsService);

  HtmlsService.$inject = ['$resource'];

  function HtmlsService($resource) {
    return $resource('/api/htmls/:htmlId', {
      htmlId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
