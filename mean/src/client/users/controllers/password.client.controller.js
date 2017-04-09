(function() {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$state', '$stateParams', 'UsersService', '$location', 'Authentication', 'Notification', 'localStorageService'];

  function PasswordController($scope, $state, $stateParams, UsersService, $location, Authentication, Notification, localStorageService) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.authentication = Authentication;
    vm.passwordDetails = {};

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Change user password
    function resetUserPassword() {
      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      Notification.success({
        message: response.message,
        title: '<i class="uk-icon-check"></i> Password reset email sent successfully!'
      });
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      Notification.error({
        message: response.data.message,
        title: '<i class="uk-icon-ban"></i> Failed to send password reset email!',
        delay: 4000
      });
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      localStorageService.set('userId', Authentication.user._id);
      Notification.success({
        message: '<i class="uk-icon-check"></i> Password reset successful!'
      });
      // And redirect to the index page
      $state.go('home');
    }

    function onResetPasswordError(response) {
      Notification.error({
        message: '<i class="uk-icon-ban"></i> Password reset failed!',
        delay: 4000
      });
      $state.go('home');
    }
  }
}());
