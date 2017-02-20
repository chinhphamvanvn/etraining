(function () {
  'use strict';

  angular
    .module('settings')
    .controller('AnnoucementListController', AnnoucementListController);

  AnnoucementListController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window', 'Notification', 'AnnoucementsService', '_'];
  
  function AnnoucementListController($scope, $rootScope, $state, Authentication, menuService, $timeout, $window, Notification, AnnoucementsService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.annoucements = AnnoucementsService.query();
    vm.publish = publish;
    
    function publish(message) {

        message.$update(function (response) {
            Notification.success({ message: '<i class="uk-icon-ok"></i> Annoucement updated successfully!' });
            reloadTree();
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Annoucement updated error!' });
         });
    }
   
    function remove(message) {
        UIkit.modal.confirm('Are you sure?', function(){
            message.$remove(vm.annoucements = _.reject(vm.annoucements,function(item) {
                return item._id == message._id;
            }));
         });
    }
  }
}());
