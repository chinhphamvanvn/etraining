(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', 'Authentication', 'CoursesService','CourseMembersService','SettingsService', 'AnnoucementsService', '_'];
  
  function HomeController($scope, $state, Authentication, CoursesService, CourseMembersService,SettingsService, AnnoucementsService, _) {
    var vm = this;
    vm.user = Authentication.user;
    vm.authentication = Authentication;
    vm.gotoWorkspace = gotoWorkspace;
    SettingsService.registerMode().then(function(data) {
        vm.registerSetting = data;
    });
    
    
    function gotoWorkspace() {
        if (_.contains(vm.user.roles,'admin'))
            $state.go('admin.workspace.dashboard');
        else
            $state.go('workspace.lms.courses.me');
    }
    
    vm.annoucements = AnnoucementsService.listPublished();
    vm.courses = CoursesService.listPublic();
        
  }
}());
