(function() {
  'use strict';

  // Create the Socket.io wrapper service
  angular
    .module('core')
    .factory('presentationSocket', presentationSocket);

  presentationSocket.$inject = ['Authentication', '$state', '$timeout', 'Socket'];

  function presentationSocket(Authentication, $state, $timeout, Socket) {
    var service = {
      connect: Socket.connect,
      emit: emit,
      on: on,
      removeListener: removeListener,
      socket: Socket.socket
    };
    var CHANNEL_ID = 'presentation';

    return service;

    // Wrap the Socket.io 'emit' method
    function emit(data) {
      if (service.socket) {
        service.socket.emit(CHANNEL_ID, data);
      }
    }

    // Wrap the Socket.io 'on' method
    function on(callback) {
      if (service.socket) {
        service.socket.on(CHANNEL_ID, function(data) {
          $timeout(function() {
            callback(data);
          });
        });
      }
    }

    // Wrap the Socket.io 'removeListener' method
    function removeListener() {
      if (service.socket) {
        service.socket.removeListener(CHANNEL_ID);
      }
    }
  }
}());
