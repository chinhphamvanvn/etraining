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
    vm.gotoSignup = gotoSignup;
    vm.gotoSignin = gotoSignin;

    SettingsService.registerMode().then(function(data) {
        vm.registerSetting = data;
    });

    function gotoWorkspace() {
        if (_.contains(vm.user.roles,'admin'))
            $state.go('admin.workspace.dashboard');
        else
            $state.go('workspace.lms.courses.me');
    }

    function gotoSignup() {
      UIkit.offcanvas.hide(false);
      $state.go('authentication.signup');
    }

    function gotoSignin() {
      UIkit.offcanvas.hide(false);
      $state.go('authentication.signin');
    }

    vm.annoucements = AnnoucementsService.listPublished();
    vm.totalItems = CoursesService.listPublic(function() {
      vm.courses = vm.totalItems.slice(0, 8);
    });

    vm.gotoSearch = function() {
      if (!vm.keyword.trim()) return ;
      $state.go('search', {keyword: vm.keyword});
    };
  }
}());
