(function(UIkit) {
  'use strict';

  angular
    .module('conference')
    .filter('allocated', ['_', function(_) {
      return function(items) {
        return _.filter(items, function(item) {
          return item.allocated;
        });

      };
    }]);

  // Conference controller
  angular
    .module('conference')
    .controller('ConferenceController', ConferenceController);

  ConferenceController.$inject = ['$scope', '$state', '$window', 'localStorageService', '$timeout', 'classResolve', 'memberResolve', 'Notification', 'conferenceSocket', 'webrtcSocket', 'CourseMembersService', '$translate', '_'];

  function ConferenceController($scope, $state, $window, localStorageService, $timeout, classroom, member, Notification, conferenceSocket, webrtcSocket, CourseMembersService, $translate, _) {
    var vm = this;
    vm.classroom = classroom;
    vm.member = member;
    vm.onConnecting = onConnecting;
    vm.onConnected = onConnected;
    vm.onDisconnected = onDisconnected;
    vm.onInvited = onInvited;
    vm.onDiscarded = onDiscarded;
    vm.teacher = CourseMembersService.get({
      memberId: vm.classroom.teacher
    });
    vm.students = CourseMembersService.byClass({
      classroomId: vm.classroom._id
    });

    conferenceSocket.init(vm.classroom._id);


    function onConnected() {
      vm.connected = true;
      vm.connecting = false;
      var localCamera = document.getElementById('localCamera');
      webrtcSocket.publishWebcam(localCamera, function() {
        vm.webcamReady = true;
        if (vm.member.role === 'teacher')
          conferenceSocket.publishChannel();
      });
    }

    function onInvited() {
      if (vm.webcamReady)
        conferenceSocket.publishChannel();
    }

    function onDiscarded() {
      conferenceSocket.unpublishChannel();
    }

    function onDisconnected() {
      vm.connected = false;
      vm.selectPanel = '';
      webrtcSocket.unpublish();
      conferenceSocket.unpublishChannel();
      if (vm.member.role == 'student')
        webrtcSocket.unsubscribe(vm.teacher.member._id);
    }

    function onConnecting() {
      vm.connected = false;
      vm.connecting = true;
    }
  }
}(window.UIkit));
