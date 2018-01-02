(function(UIkit) {
  'use strict';

  angular
    .module('users.admin')
    .controller('AdminEditController', AdminEditController);

  AdminEditController.$inject = ['$scope', '$state', '$rootScope', '$timeout', '$window', 'AdminService', 'userResolve', 'Authentication', 'Notification', 'Upload', 'GroupsService', 'UsersService', 'localStorageService', 'treeUtils', '$translate', '_'];

  function AdminEditController($scope, $state, $rootScope, $timeout, $window, AdminService, user, Authentication, Notification, Upload, GroupsService, UsersService, localStorageService, treeUtils, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.isContextUserSelf = isContextUserSelf;
    vm.currentUserId = localStorageService.get('userId');
    vm.selectGroup = selectGroup;
    vm.changeUserPassword = changeUserPassword;

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

    var $birthday = $('#uk_birthday');

    var enroll_birthday = UIkit.datepicker($birthday, {
      format: 'DD.MM.YYYY'
    });
    $birthday.on('change', function() {
      vm.user.birthday = moment($birthday.val(), 'DD.MM.YYYY');
    });

    var $startDate = $('#uk_start_date');

    var enroll_start_date = UIkit.datepicker($startDate, {
      format: 'DD.MM.YYYY'
    });
    $startDate.on('change', function() {
      vm.user.startDate = moment($startDate.val(), 'DD.MM.YYYY');
    });

    function remove() {
      if (isContextUserSelf())
        return;
      UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        AdminService.remove({
          userId: vm.user._id
        }, function() {
          $state.go('admin.workspace.users.list');
          Notification.success({
            message: '<i class="uk-icon-check"></i> User deleted successfully!'
          });
        });
      });
    }

    function cancel() {
      $state.go('admin.workspace.users.view', {
        userId: vm.user._id
      });
    }

    function selectGroup(groups) {
      if (groups && groups.length)
        vm.user.group = groups[0];
    }

    function save() {
      if (!vm.user.group) {
        UIkit.modal.alert($translate.instant('ERROR.USER_EDIT.EMPTY_ORG_GROUP'));
        return;
      }

      if (!vm.user._id)
        vm.user.$save(onSaveSuccess, onSaveFailure);
      else
        vm.user.$update(onSaveSuccess, onSaveFailure);
    }

    function onSaveSuccess(response) {
      if (!vm.avatar) {
        Notification.success({
          message: '<i class="uk-icon-check"></i> User saved successfully!'
        });
        $state.go('admin.workspace.users.list');
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
        $state.go('admin.workspace.users.list');
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

  }
}(window.UIkit));
