(function() {
  'use strict';

  angular
    .module('users')
    .controller('UserEditController', UserEditController);

  UserEditController.$inject = ['$scope', '$state', '$rootScope', '$window', 'userResolve', 'Authentication', 'Notification', 'Upload', 'UsersService', 'localStorageService', '_'];

  function UserEditController($scope, $state, $rootScope, $window, user, Authentication, Notification, Upload, UsersService, localStorageService, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = user;
    vm.save = save;
    vm.cancel = cancel;
    vm.isContextUserSelf = isContextUserSelf;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.removeUserSocialAccount = removeUserSocialAccount;
    vm.callOauthProvider = callOauthProvider;
    vm.changeUserPassword = changeUserPassword;
    vm.currentUserId = localStorageService.get('userId');

    var $basicValidate = $('#user_edit_form');
    var $changePassValidate = $('#user_change_pass_form');

    $basicValidate
      .parsley()
      .on('form:validated', function() {
        $scope.$apply();
      })
      .on('field:validated', function(parsleyField) {
        if ($(parsleyField.$element).hasClass('md-input')) {
          $scope.$apply();
        }
      });
    $changePassValidate
      .parsley()
      .on('form:validated', function() {
        $scope.$apply();
      })
      .on('field:validated', function(parsleyField) {
        if ($(parsleyField.$element).hasClass('md-input')) {
          $scope.$apply();
        }
      });

    vm.roleSwitcherOptions = [
      {
        id: 1,
        title: 'User',
        value: 'user'
      },
      {
        id: 2,
        title: 'Admin',
        value: 'admin'
      }
    ];
    vm.roleSwitcherConfig = {
      plugins: {
        'remove_button': {
          label: ''
        }
      },
      maxItems: null,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title',
      create: false
    };


    function cancel() {
      $state.go('workspace.users.view');
    }

    function save() {
      vm.user.$update(onSaveSuccess, onSaveFailure);
    }

    function onSaveSuccess(response) {
      if (!vm.avatar) {
        Notification.success({
          message: '<i class="uk-icon-check"></i> User saved successfully!'
        });
        $state.go('workspace.users.view');
        return;
      }
      Upload.upload({
        url: $rootScope.viewerRole === 'admin' ? '/api/users/' + vm.user._id + '/picture' : '/api/users/picture',
        data: {
          newProfilePicture: vm.avatar
        }
      }).then(function(response) {
        Notification.success({
          message: '<i class="uk-icon-check"></i> User saved successfully!'
        });
        $state.go('workspace.users.view');
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Avatar update error!'
        });
      });
    }

    function onSaveFailure(errorResponse) {
      Notification.error({
        message: errorResponse.data.message,
        title: '<i class="uk-icon-ban"></i> User update error!'
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }

    function changeUserPassword() {
      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      // If successful show success message and clear form
      Notification.success({
        message: '<i class="uk-icon-check"></i> Password Changed Successfully'
      });
      vm.passwordDetails = null;
    }

    function onChangePasswordError(response) {
      Notification.error({
        message: response.data.message,
        title: '<i class="uk-icon-ban"></i> Password change failed!'
      });
    }


    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {
      UsersService.removeSocialAccount(provider)
        .then(onRemoveSocialAccountSuccess)
        .catch(onRemoveSocialAccountError);
    }

    function onRemoveSocialAccountSuccess(response) {
      // If successful show success message and clear form
      Notification.success({
        message: '<i class="uk-icon-check"></i> Removed successfully!'
      });
      vm.user = Authentication.user = response;
    }

    function onRemoveSocialAccountError(response) {
      Notification.error({
        message: response.message,
        title: '<i class="uk-icon-ban"></i> Remove failed!'
      });
    }

    // OAuth provider request
    function callOauthProvider(url) {
      url += '?redirect_to=' + encodeURIComponent($state.$current.url.prefix);
      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

  }
}());
