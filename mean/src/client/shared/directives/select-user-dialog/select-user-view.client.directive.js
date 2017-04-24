(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('selectUserDialog', ['GroupsService', '$timeout', 'AdminService', '_', selectUserDialog]);

  function selectUserDialog(GroupsService, $timeout, AdminService, _) {
    return {
      scope: {
        callback: '=',
        dialogId: '='
      },
      templateUrl: '/src/client/shared/directives/select-user-dialog/select-user-view.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.selectGroup = function(groups) {
          scope.users = [];
          _.each(groups, function(group) {
            AdminService.byGroup({
              groupId: group
            }, function(users) {
              scope.users = scope.users.concat(users);
            });
          });
        };

        scope.finish = function() {
          var selectedUsers = _.filter(scope.users, function(user) {
            return user.selected;
          });
          if (scope.callback)
            scope.callback(selectedUsers);
        };

      }
    };
  }
}());
