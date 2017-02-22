(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$state', '$filter', '$compile','Authentication', 'AdminService', '$timeout', '$location', '$window', 'GroupsService', 'DTOptionsBuilder','DTColumnBuilder', 'Notification','$q','treeUtils', '$translate', '_'];

  function UserListController($scope,$state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, GroupsService,DTOptionsBuilder, DTColumnBuilder, Notification, $q, treeUtils, $translate, _) {
    var vm = this;
    vm.user = Authentication.user; 
    vm.remove = remove;
    vm.reload = true;
    vm.groupFilter = [];
    vm.users = [];
    
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
                      text: '<i class="uk-icon-plus uk-text-success"></i> '+$translate.instant("ACTION.CREATE"),
                      key: '1',
                      action: function (e, dt, node, config) {
                          $state.go('admin.workspace.users.create');
                      }
                  },                  
                  {
                      text:      '<i class="uk-icon-upload"></i> '+$translate.instant("ACTION.IMPORT"),
                      key: '2',
                      action: function (e, dt, node, config) {
                          var modal = new UIkit.modal('#import_user_dialog');
                          modal.show();
                      }
                  },
                  {
                      extend:    'print',
                      text:      '<i class="uk-icon-print"></i> '+$translate.instant("ACTION.PRINT"),
                      titleAttr: 'Print'
                  },
                  {
                      extend:    'csvHtml5',
                      text:      '<i class="uk-icon-file-excel-o"></i> '+$translate.instant("ACTION.EXPORT"),
                      titleAttr: ''
                  },
                  {
                      extend:    'colvis',
                      text:      '<i class="uk-icon-file-pdf-o"></i> '+$translate.instant("ACTION.COLUMN"),
                      titleAttr: 'PDF'
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
                    '<a  ui-sref="admin.workspace.users.view({userId:\''+data._id+'\'})" data-uk-tooltip="{cls:\'uk-tooltip-small\',pos:\'bottom\'}" title='+$translate.instant('ACTION.VIEW')+'><i class="md-icon material-icons">remove_red_eye</i></a>'+
                    '<a  ng-click="vm.remove(\''+data._id+'\')"><i class="md-icon uk-text-danger material-icons" data-uk-tooltip="{cls:\'uk-tooltip-small\',pos:\'bottom\'}" title='+$translate.instant('ACTION.DELETE')+'>delete</i></a>';
        }), 
    ];
    vm.dtInstance = {};
    
    vm.groups = GroupsService.listOrganizationGroup( function() {
        var tree = treeUtils.buildGroupTree(vm.groups);
        $timeout(function() {
            $("#orgTree").fancytree({
                checkbox: true,
                titlesTabbable: true,
                selectMode:3,
                clickFolderMode:3,
                imagePath: "/assets/icons/others/",
                extensions: ["wide"],
                autoScroll: true,
                generateIds: true,
                source: tree,
                toggleEffect: { effect: "blind", options: {direction: "vertical", scale: "box"}, duration: 200 },
                select: function(event, data) {
                    // Display list of selected nodes
                    vm.groupFilter = _.map( data.tree.getSelectedNodes(), function(obj) {
                        return obj.data._id;
                    });
                    vm.dtInstance.reloadData(function() {}, true);
                }
            });
        });
   }); 
  
    
   
    function remove(id) {
        if (id == vm.user._id)
            return;
        UIkit.modal.confirm('Are you sure?', function(){
            AdminService.remove({userId:id},function () {
                vm.reload = true;
                vm.dtInstance.reloadData(function() {}, true);
                Notification.success({ message: '<i class="uk-icon-check"></i> User deleted successfully!' });
              });
         });
    }
    
    function loadUser() {          
        // perform some asynchronous operation, resolve or reject the promise when appropriate.
        return $q(function(resolve, reject) {
            if (vm.reload) {
                vm.users = AdminService.query(function() {
                    vm.reload =  false;
                    resolve(vm.users);
                },function error() {
                    vm.reload = false;
                    reject();
                });
            } else {
                var users = _.filter(vm.users,function(user) {
                    return (vm.groupFilter.length==0 || (vm.groupFilter.length && user.group && _.contains(vm.groupFilter,user.group._id)));
                });
                resolve(users);
            }
            });
      }  
  }

}());
