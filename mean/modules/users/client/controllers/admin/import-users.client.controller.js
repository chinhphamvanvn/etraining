(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserImportController', UserImportController);

  UserImportController.$inject = ['$scope', '$state',  '$filter', '$compile','Authentication', 'AdminService', '$timeout', '$location', '$window', 'GroupsService','UsersService', 'DTOptionsBuilder','DTColumnDefBuilder', 'Notification','treeUtils', '$q',  '_'];

  function UserImportController($scope,$state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, GroupsService,UsersService, DTOptionsBuilder, DTColumnDefBuilder, Notification, treeUtils,$q, _) {
    var vm = this;
    vm.user = Authentication.user; 
    vm.users = [];
    vm.headers = [];
    vm.importData = importData;
    vm.csv = {
            content: null,
            header: true,
            headerVisible: true,
            separator: ',',
            result: null,
            encoding: 'ISO-8859-1',
            acceptSize: 4*1024,
            uploadButtonLabel: "Select CSV file"
        };
    vm.finishLoad = finishLoad;
    
    vm.groups = GroupsService.listOrganizationGroup( function() {
        var tree = treeUtils.buildGroupTree(vm.groups);
        $timeout(function() {
            $("#departmentTree").fancytree({
                checkbox: true,
                selectMode:1,
                titlesTabbable: true,
                autoScroll: true,
                generateIds: true,
                source: tree,
                select: function(event, data) {
                    // Display list of selected nodes
                    var node = data.tree.getSelectedNodes()[0];
                    if (node)
                        vm.group = node.data._id;
                }
            });
        });
   }); 
    
    vm.columnOptions = 
            [
                {
                    id: 1,
                    title: "First name",
                    value: "firstName",
                    parent_id: 1
                },
                {
                    id: 2,
                    title: "Last name",
                    value: "lastName",
                    parent_id: 1
                },
                {
                    id: 3,
                    title: "Username",
                    value: "username",
                    parent_id: 1
                },
                {
                    id: 4,
                    title: "Email",
                    value: "email",
                    parent_id: 1
                },
                {
                    id: 5,
                    title: "Phone",
                    value: "phone",
                    parent_id: 1
                },
                {
                    id: 6,
                    title: "Position",
                    value: "position",
                    parent_id: 1
                },
                {
                    id: 7,
                    title: "Facebook",
                    value: "facebook",
                    parent_id: 1
                }
                ,
                {
                    id: 8,
                    title: "Twitter",
                    value: "twitter",
                    parent_id: 1
                }
            ];
        

    vm.columnConfigs = {
        create: false,
        maxItems: 1,
        placeholder:'Match column',
        valueField: 'value',
        labelField: 'title',
        searchField: 'title',
        optgroupField: 'parent_id',
        optgroupLabelField: 'title',
        optgroupValueField: 'ogid',
        onInitialize: function(selectize){
        }
    };
    
    var closeButton = $('#dialogClose');
    
    function finishLoad() {
        if (!vm.csv.result.headers  || vm.csv.result.headers.length == 0) {
            vm.headers = [];
            for (var i=0;i<vm.csv.result.columnCount;i++)
                vm.headers.push({name:i});
        } else {
            vm.headers = [];
            for (var i=0;i<vm.csv.result.columnCount;i++)
                vm.headers.push({name:vm.csv.result.headers[i]});
        }
        vm.users = vm.csv.result.rows;
        $scope.$apply();
    }
    
    function importData() {
        var unmatchHeader = _.find(vm.headers,function(header,index) {
            return !header.column;
        });
        if (unmatchHeader) {
            Notification.error({ message:  '<i class="uk-icon-ban"></i> Not all columns are matched!' });
            return;
        }            
        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
        var allPromise = [];
        _.each(vm.users,function(user) {
            if (!user.removed) {
                var userService = new UsersService();
                _.each(vm.headers,function(header,index) {
                    userService[header.column] = user[index];
                });
                userService.group = vm.group;
                allPromise.push(userService.$save().$promise);
            }
        });
        $q.all(allPromise).then(function() {
            vm.users = [];
            modal.hide();
            $window.location.reload();
        });
    }
  }

}());
