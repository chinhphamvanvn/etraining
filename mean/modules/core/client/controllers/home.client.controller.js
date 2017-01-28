(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', 'Authentication', 'menuService','AnnoucementsService', '_'];
  
  function HomeController($scope, $state, Authentication, menuService, AnnoucementsService, _) {
    var vm = this;
    vm.user = Authentication.user;
    vm.authentication = Authentication;
    vm.gotoWorkspace = gotoWorkspace;
    function gotoWorkspace() {
        if (_.contains(vm.user.roles,'admin'))
            $state.go('admin.workspace.dashboard');
        else
            $state.go('workspace.dashboard');
    }
    
    vm.annoucements = AnnoucementsService.listPublished();
        
  }
}());
