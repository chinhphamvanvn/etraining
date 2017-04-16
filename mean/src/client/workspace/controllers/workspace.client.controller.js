(function(UIkit) {
  'use strict';

  angular
    .module('workspace')
    .controller('WorkspaceController', WorkspaceController);

  WorkspaceController.$inject = ['$scope', '$rootScope', '$state', 'userResolve', 'permissionViewResolve', 'menuService', '$timeout', '$window', 'MessagesService', '_'];

  function WorkspaceController($scope, $rootScope, $state, user, permissionView, menuService, $timeout, $window, MessagesService, _) {
    var vm = this;
    vm.permissionView = permissionView;
    vm.user = user;
    vm.menu = menuService.getMenu('sidebar');
    vm.switchPanel = switchPanel;
    vm.viewProfile = viewProfile;
    vm.hasAdminRole = _.contains(vm.user.roles, 'admin');
    vm.alerts = MessagesService.waiting({
      userId: vm.user._id
    });
    vm.closeAlert = closeAlert;
    vm.sections = [];

    $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function() {
      $timeout(function() {
        $($window).resize();
      }, 280);
    });

    $scope.$on('onLastRepeat', function(scope, element, attrs) {
      $timeout(function() {
        if (!$rootScope.miniSidebarActive) {
          // activate current section
          $('#sidebar_main').find('.current_section > a').trigger('click');
        } else {
          // add tooltips to mini sidebar
          var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
          tooltip_elem.each(function() {
            var $this = $(this);

            $this.attr('title', $this.find('.menu_title').text());
            UIkit.tooltip($this, {
              pos: 'right'
            });
          });
        }
      });
    });

    function closeAlert(alert) {
      alert.$remove(function() {
        vm.alerts = _.reject(vm.alerts, function(obj) {
          return obj._id === alert._id;
        });
      });
    }

    function viewProfile() {
      if ($rootScope.viewerRole === 'user')
        $state.go('workspace.users.view');
      else
        $state.go('admin.workspace.users.view', {
          userId: vm.user._id
        });
    }

    function filterByPermission(menuKey) {
      if (!vm.permissionView)
        return true;
      if ($rootScope.viewerRole === 'user') {
        return _.contains(vm.permissionView.userMenu, menuKey);
      }
      if ($rootScope.viewerRole === 'admin') {
        return _.contains(vm.permissionView.adminMenu, menuKey);
      }
      return false;
    }

    function updateSidebar() {
      var sections = _.filter(vm.menu.items, function(menu) {
        return (menu.roles.indexOf('*') !== -1) || (_.contains(menu.roles, $rootScope.viewerRole) && filterByPermission(menu.title));
      });
      sections = _.sortBy(sections, function(menu) {
        return menu.position;
      });
      _.each(sections, function(section, index) {
        var submenu = _.filter(section.items, function(menu) {
          return (menu.roles.indexOf('*') !== -1) || (_.contains(menu.roles, $rootScope.viewerRole) && filterByPermission(menu.title));
        });

        submenu = _.sortBy(submenu, function(menu) {
          return menu.position;
        });
        submenu = _.map(submenu, function(menu) {
          return {
            title: menu.title,
            link: menu.state
          };
        });
        var state = $state.get(section.state);
        var menu = {
          id: index,
          title: section.title,
          icon: section.icon,
          link: state.abstract ? '' : state.name,
          submenu: submenu
        };
        vm.sections.push(menu);
      });
    }


    function switchPanel() {
      if ($rootScope.viewerRole === 'admin') {
        $state.go('workspace.lms.courses.me');
      } else {
        $state.go('admin.workspace.dashboard');
      }

    }

    updateSidebar();
  }
}(window.UIkit));
