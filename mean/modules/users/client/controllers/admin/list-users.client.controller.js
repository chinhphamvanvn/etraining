(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$state', '$filter', '$compile','Authentication', 'AdminService', '$timeout', '$location', '$window', 'GroupsService', 'DTOptionsBuilder','DTColumnBuilder', 'Notification','$q','treeUtils', '$translate', '_'];

  function UserListController($scope,$state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, GroupsService,DTOptionsBuilder, DTColumnBuilder, Notification, $q, treeUtils, $translate, _) {
    var vm = this;
    vm.finishEditOrgTree =  finishEditOrgTree;
    vm.remove = remove;
    vm.dtInstance = {};
    
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(loadUser).withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
    .withPaginationType('full_numbers')
     .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
        "<'uk-overflow-container'tr>" +
        "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
    .withButtons([                                  
                  {
                      extend:    'print',
                      text:      '<i class="uk-icon-print"></i> '+$translate.instant("ACTION.PRINT"),
                  },
                  {
                      extend:    'csvHtml5',
                      text:      '<i class="uk-icon-file-excel-o"></i> '+$translate.instant("ACTION.EXPORT"),
                  },
                  {
                      extend:    'colvis',
                      text:      '<i class="uk-icon-file-pdf-o"></i> '+$translate.instant("ACTION.COLUMN"),
                  }
              ]);
    
    vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.USER.AVATAR')).notSortable()
        .renderWith(function(data, type, full, meta) {
            return '<a href="#" class="user_action_image"><img class="md-user-image" src=\''+ data.profileImageURL + '\'  alt="" add-image-prop/></a>';
        }),        
        DTColumnBuilder.newColumn('displayName').withTitle($translate.instant('MODEL.USER.DISPLAY_NAME')),
        DTColumnBuilder.newColumn('username').withTitle($translate.instant('MODEL.USER.USERNAME')),
        DTColumnBuilder.newColumn('email').withTitle($translate.instant('MODEL.USER.EMAIL')),
        DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.USER.GROUP'))
        .renderWith(function(data, type, full, meta) {
            if (data.group)
                return data.group.name;
            else
                return '';
        }),
        DTColumnBuilder.newColumn('phone').withTitle($translate.instant('MODEL.USER.PHONE')).notVisible(),
        DTColumnBuilder.newColumn('position').withTitle($translate.instant('MODEL.USER.POSITION')).notVisible(),
        DTColumnBuilder.newColumn('facebook').withTitle('Facebook').notVisible(),
        DTColumnBuilder.newColumn('twitter').withTitle('Twitter').notVisible(),
        DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.USER.STATUS')).notSortable()
        .renderWith(function(data, type, full, meta) {
            if (data.banned)
                return '<span class="uk-badge uk-badge-danger">Banned</span>';
            else
                return '<span class="uk-badge uk-badge-success">Ok</span>';
        }),       ,
        DTColumnBuilder.newColumn('roles').withTitle($translate.instant('MODEL.USER.ROLE')),
        DTColumnBuilder.newColumn(null).withTitle($translate.instant('COMMON.ACTION')).notSortable()
        .renderWith(function(data, type, full, meta) {
            return '<a ui-sref="admin.workspace.users.edit({userId:\''+data._id+'\'})" data-uk-tooltip="{cls:\'uk-tooltip-small\',pos:\'bottom\'}" title='+$translate.instant('ACTION.EDIT')+'><i class="md-icon material-icons">edit</i></a>' +
                    '<a  ui-sref="admin.workspace.users.view({userId:\''+data._id+'\'})" data-uk-tooltip="{cls:\'uk-tooltip-small\',pos:\'bottom\'}" title='+$translate.instant('ACTION.VIEW')+'><i class="md-icon material-icons">info_outline</i></a>'+
                    '<a  ng-click="vm.remove(\''+data._id+'\')"><i class="md-icon uk-text-danger material-icons" data-uk-tooltip="{cls:\'uk-tooltip-small\',pos:\'bottom\'}" title='+$translate.instant('ACTION.DELETE')+'>delete</i></a>';
        }), 
    ];
    
    vm.selectGroup = function(groups) {
        vm.groups = groups;
       if (groups && groups.length)
            vm.dtInstance.reloadData(function() {}, true);
    }
    
    function finishEditOrgTree() {
        $window.location.reload();
    }
   
    function remove(id) {
        if (id == vm.user._id)
            return;
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
            AdminService.remove({userId:id},function () {
                vm.dtInstance.reloadData(function() {}, true);
                Notification.success({ message: '<i class="uk-icon-check"></i> User deleted successfully!' });
              });
         });
    }
    
    function loadUser() {        
        // perform some asynchronous operation, resolve or reject the promise when appropriate.
        return $q(function(resolve, reject) {
            var allPromise  = [];
            _.each(vm.groups,function(group) {
               allPromise.push(AdminService.byGroup({groupId:group}).$promise); 
            });
            var userList = [];
            $q.all(allPromise).then(function(usersArray) {
                _.each(usersArray,function(users) {
                    userList = userList.concat(users);
                });
                resolve(userList);
            });
        });
    }
  }

}());
