// Messages service used to communicate Messages REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource', '_transform'];

  function MessagesService($resource, _transform) {
    return $resource('/api/messages/:messageId', {
      messageId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      waiting: {
        method: 'GET',
        url: '/api/messages/waiting',
        isArray: true
      }
    });
  }
}());
