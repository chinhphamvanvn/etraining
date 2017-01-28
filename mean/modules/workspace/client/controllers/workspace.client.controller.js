(function () {
  'use strict';

  angular
    .module('workspace')
    .controller('WorkspaceController', WorkspaceController);

  WorkspaceController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'menuService', '$timeout', '$window', '_'];
  
  function WorkspaceController($scope, $rootScope, $state, Authentication, menuService,$timeout, $window, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
    vm.menu = menuService.getMenu('sidebar');
    vm.switchPanel = switchPanel;
    vm.hasAdminRole = _.contains(vm.user.roles,'admin');    
    vm.user.alerts =  [
                {
                    "title": "Hic expedita eaque.",
                    "content": "Nemo nemo voluptatem officia voluptatum minus.",
                    "type": "warning"
                },
                {
                    "title": "Voluptatibus sed eveniet.",
                    "content": "Tempora magnam aut ea.",
                    "type": "success"
                },
                {
                    "title": "Perferendis voluptatem explicabo.",
                    "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                    "type": "danger"
                },
                {
                    "title": "Quod minima ipsa.",
                    "content": "Vel dignissimos neque enim ad praesentium optio.",
                    "type": "primary"
                }
            ];
    
        vm.alerts_length = vm.user.alerts.length;


        $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function(){
            $timeout(function() {
                $($window).resize();
            },280)
        });

        $scope.$on('onLastRepeat', function (scope, element, attrs) {
            $timeout(function() {
                if(!$rootScope.miniSidebarActive) {
                    // activate current section
                    $('#sidebar_main').find('.current_section > a').trigger('click');
                } else {
                    // add tooltips to mini sidebar
                    var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                    tooltip_elem.each(function() {
                        var $this = $(this);

                        $this.attr('title',$this.find('.menu_title').text());
                        UIkit.tooltip($this, {
                            pos: 'right'
                        });
                    });
                }
            })
        });

        function updateSidebar() {
            vm.sections = [];
            var sections = _.filter(vm.menu.items,function(menu) {
                return (menu.roles.indexOf('*') != -1) || _.contains(menu.roles,$rootScope.viewerRole);
            });
            sections = _.sortBy(sections, function(menu) { return menu.position; });
            _.each(sections, function(section,index) {
                var submenu = _.filter(section.items,function(menu) {
                    return (menu.roles.indexOf('*') != -1) || _.contains(menu.roles,$rootScope.viewerRole);
                });
                submenu = _.sortBy(submenu, function(menu) { return menu.position; });
                submenu = _.map(submenu, function(menu) {
                    return {
                        title:menu.title,
                        link: menu.state
                    }
                });
                var state = $state.get(section.state);
                var menu = {
                    id: index,
                    title: section.title,
                    icon: section.icon,
                    link: state.abstract?'':state.name,
                    submenu: submenu
                };
                vm.sections.push(menu);
            });
        }
        
        
        function switchPanel() {
            if ($rootScope.viewerRole=='admin') {
                $state.go('workspace.dashboard');
            } else {
                $state.go('admin.workspace.dashboard');
            }
            
        }
        
        updateSidebar();
  }
}());
