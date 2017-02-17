// Messages service used to communicate Messages REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource'];

  function MessagesService($resource) {
    return $resource('/api/messages/:messageId', {
      messageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
