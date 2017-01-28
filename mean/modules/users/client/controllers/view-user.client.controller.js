(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserViewController', UserViewController);

  UserViewController.$inject = ['$scope', '$state', '$timeout', '$rootScope','$window','userResolve', 'Authentication', 'Notification', 'UsersService', 'UserLogsService', 'GroupsService', 'treeUtils', '_'];

  function UserViewController($scope, $state, $timeout, $rootScope, $window, user, Authentication, Notification, UsersService, UserLogsService, GroupsService, treeUtils,  _) {
    var vm = this;
    vm.authentication = Authentication;    
    vm.user = user;
    vm.edit = edit;
    if ($rootScope.viewerRole=='admin') 
        vm.logs = UserLogsService.userLogsByAdmin({userId:vm.user._id});
    else
        vm.logs = UserLogsService.userLogs({userId:vm.user._id});

    function edit() {
       if ($rootScope.viewerRole=='admin') 
           $state.go('admin.workspace.users.edit', {userId:vm.user._id});
       else
           $state.go('workspace.users.edit');
    }
    
    vm.groups = GroupsService.listOrganizationGroup( function() {
        var tree = treeUtils.buildTree(vm.groups);
        if (vm.user.group) {
            var selectNode = treeUtils.findNode(tree, vm.user.group);
            selectNode.selected = true;
        }
        $timeout(function() {
            $("#orgTree").fancytree({
                checkbox: true,
                selectMode:1,
                titlesTabbable: true,
                disabled: true,
                autoScroll: true,
                generateIds: true,
                source: tree,
               
            });
        });
   }); 
  }
}());
