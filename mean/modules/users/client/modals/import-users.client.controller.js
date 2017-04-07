(function(UIkit) {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserImportController', UserImportController);

  UserImportController.$inject = ['$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', '$timeout', '$location', '$window', 'GroupsService', 'UsersService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Notification', 'treeUtils', '$translate', '_'];

  function UserImportController($scope, $state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, GroupsService, UsersService, DTOptionsBuilder, DTColumnDefBuilder, Notification, treeUtils, $translate, _) {
    var vm = this;
    vm.user = Authentication.user;
    vm.users = [];
    vm.headers = [];
    vm.importData = importData;
    vm.selectedGroup = selectedGroup;
    vm.csv = {
      content: null,
      header: true,
      headerVisible: true,
      separator: ',',
      result: null,
      encoding: 'ISO-8859-1',
      acceptSize: 4 * 1024,
      uploadButtonLabel: 'Select CSV file'
    };
    vm.finishLoad = finishLoad;

    vm.columnOptions = [
      {
        id: 1,
        title: $translate.instant('MODEL.USER.FIRST_NAME'),
        value: 'firstName',
        parent_id: 1
      },
      {
        id: 2,
        title: $translate.instant('MODEL.USER.LAST_NAME'),
        value: 'lastName',
        parent_id: 1
      },
      {
        id: 3,
        title: $translate.instant('MODEL.USER.USERNAME'),
        value: 'username',
        parent_id: 1
      },
      {
        id: 4,
        title: $translate.instant('MODEL.USER.EMAIL'),
        value: 'email',
        parent_id: 1
      },
      {
        id: 5,
        title: $translate.instant('MODEL.USER.PHONE'),
        value: 'phone',
        parent_id: 1
      },
      {
        id: 6,
        title: $translate.instant('MODEL.USER.POSITION'),
        value: 'position',
        parent_id: 1
      },
      {
        id: 7,
        title: $translate.instant('MODEL.USER.FACEBOOK'),
        value: 'facebook',
        parent_id: 1
      },
      {
        id: 8,
        title: $translate.instant('MODEL.USER.TWITTER'),
        value: 'twitter',
        parent_id: 1
      }
    ];


    vm.columnConfigs = {
      create: false,
      maxItems: 1,
      placeholder: 'Column',
      valueField: 'value',
      labelField: 'title'
    };

    var closeButton = $('#dialogClose');

    function finishLoad() {
      var i;
      if (!vm.csv.result.headers || vm.csv.result.headers.length === 0) {
        vm.headers = [];
        for (i = 0; i < vm.csv.result.columnCount; i++)
          vm.headers.push({
            name: i
          });
      } else {
        vm.headers = [];
        for (i = 0; i < vm.csv.result.columnCount; i++)
          vm.headers.push({
            name: vm.csv.result.headers[i]
          });
      }
      vm.users = vm.csv.result.rows;
      $scope.$apply();
    }

    function importData() {
      if (!vm.group || vm.group.length === 0) {
        UIkit.modal.alert($translate.instant('ERROR.USER_EDIT.EMPTY_ORG_GROUP'));
        return;
      }
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      var userList = [];
      _.each(vm.users, function(user) {
        if (!user.removed) {
          var createUser = {};
          _.each(vm.headers, function(header, index) {
            if (header.column && !header.deleted)
              createUser[header.column] = user[index];
          });
          createUser.group = vm.group[0];
          userList.push(createUser);
        }
      });
      AdminService.bulkCreate({
        users: userList
      }, function() {
        modal.hide();
        $window.location.reload();
      }, function(errorResponse) {
        modal.hide();
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> User import error!'
        });
      });
    }

    function selectedGroup(groups) {
      vm.group = groups;
    }
  }

}(window.UIkit));
