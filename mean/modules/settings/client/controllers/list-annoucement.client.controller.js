(function(UIkit) {
  'use strict';

  angular
    .module('settings')
    .controller('AnnoucementListController', AnnoucementListController);

  AnnoucementListController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'menuService', '$timeout', '$window', 'Notification', 'AnnoucementsService', '$translate', '_'];

  function AnnoucementListController($scope, $rootScope, $state, Authentication, menuService, $timeout, $window, Notification, AnnoucementsService, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.annoucements = AnnoucementsService.query();
    vm.publish = publish;
    vm.distributeMessage = distributeMessage;

    function publish(message) {
      message.$update(function(response) {
        Notification.success({
          message: '<i class="uk-icon-ok"></i> Annoucement updated successfully!'
        });
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Annoucement updated error!'
        });
      });
    }

    function remove(message) {
      UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        message.$remove(vm.annoucements = _.reject(vm.annoucements, function(item) {
          return item._id === message._id;
        }));
      });
    }

    function distributeMessage(users) {
      console.log(vm.selectedMessage._id);
      var userIds = _.pluck(users, '_id');
      console.log(userIds);

      vm.selectedMessage.$distribute({
        users: userIds
      }, function() {
        Notification.success({
          message: '<i class="uk-icon-ok"></i> Annoucement sent successfully!'
        });
      });

    }
  }
}(window.UIkit));
