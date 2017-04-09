/**
 * Created by thanhvk on 2/28/2017.
 */
(function(UIkit) {
  'use strict';

  angular
    .module('core')
    .controller('HomeSearchController', HomeSearchController);

  HomeSearchController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'CoursesService', 'CourseMembersService', 'SettingsService', 'AnnoucementsService', '_'];

  function HomeSearchController($scope, $state, $stateParams, Authentication, CoursesService, CourseMembersService, SettingsService, AnnoucementsService, _) {
    var vm = this;
    vm.keyword = '';

    vm.user = Authentication.user;
    vm.authentication = Authentication;
    vm.gotoWorkspace = gotoWorkspace;
    SettingsService.registerMode().then(function(data) {
      vm.registerSetting = data;
    });


    function gotoWorkspace() {
      if (_.contains(vm.user.roles, 'admin'))
        $state.go('admin.workspace.dashboard');
      else
        $state.go('workspace.lms.courses.me');
    }

    vm.annoucements = AnnoucementsService.listPublished();

    vm.coursesByKeyword = CoursesService.listByKeyword({
      keyword: $stateParams.keyword
    }, function() {
      vm.courses = vm.coursesByKeyword;
    });

    vm.gotoSearch = function() {
      if (!vm.keyword.trim()) return;
      $state.go('search', {
        keyword: vm.keyword
      });
    };
  }
}(window.UIkit));
