(function () {
  'use strict';

  angular
    .module('library')
    .controller('LibraryContentsListController', LibraryContentsListController);

  LibraryContentsListController.$inject = ['$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'GroupsService', 'Upload', 'Notification', 'LibraryMediaService', 'treeUtils', '$q', '$translate', '_'];

  function LibraryContentsListController($scope, $state, $stateParams, $timeout, $location, $window, GroupsService, Upload, Notification, LibraryMediaService, treeUtils, $q, $translate, _) {
    var vm = this;
    vm.createMediaItem = createMediaItem;
    vm.remove = remove;
    vm.finishEditLibTree = finishEditLibTree;

    vm.groups = GroupsService.listLibraryGroup(function() {
        vm.nodes = treeUtils.buildGroupTree(vm.groups);
        vm.nodeList = treeUtils.buildGroupListInOrder(vm.nodes);
    });

    vm.allMedias = LibraryMediaService.query(function() {
      vm.allMedias = _.filter(vm.allMedias, function(m) {
        return m.published;
      });

      vm.medium = vm.allMedias;
    });

    vm.getAllMedias = function() {
      vm.medium = vm.allMedias;
    };

    vm.expand =  expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;

    function toggleExpand(node) {
        node.data.mediumList = [];
        vm.group = [node.data._id];
        vm.number = 0;
        var childsNode = treeUtils.buildGroupListInOrder([node]);
        childsNode.map(function(child) {
            LibraryMediaService.byGroup({groupId:child.data._id},function(medium) {
                vm.number++;
                child.data.medium = _.filter(medium,function(media) {
                    return media.published;
                });
                if (child.data.medium && child.data.medium.length > 0) {
                    node.data.mediumList = node.data.mediumList.concat(child.data.medium);
                }
                if(vm.number == childsNode.length) {
                    if(node.data.mediumList.length > 0) {
                        vm.medium = node.data.mediumList;
                    } else {
                        vm.medium = [];
                    }
                }
            });
        });

        // if (node.children.length == 0)
        //     return;
        // if (node.expand)
        //     collapse(node);
        // else
        //     expand(node);
    }

    function expand(node) {
        treeUtils.expandCourseNode(node,true);
    }

    function collapse(node) {
        treeUtils.expandCourseNode(node,false);
    }

    // vm.selectGroup = function (groups) {
    //   vm.group = groups;
    //   // if (groups && groups.length)
    //   //   vm.medium = LibraryMediaService.byGroup({groupId: groups[0]})
    // };

    function createMediaItem() {
      if (!vm.group || vm.group.length == 0) {
        UIkit.modal.alert($translate.instant('ERROR.LIBRARY.EMPTY_LIBRARY_GROUP'));
        return;
      }
      $state.go('admin.workspace.library.content.create', {group: vm.group})
    }

    function finishEditLibTree() {
      $window.location.reload();
    }

    function remove(item) {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        item.$remove(function () {
          vm.medium = _.reject(vm.medium, function (media) {
            return media._id == item._id;
          })
        });
      });
    }

  }
}());

