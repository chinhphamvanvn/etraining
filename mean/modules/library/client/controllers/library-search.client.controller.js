/**
 * Created by thanhvk on 2/28/2017.
 */
(function() {
  'use strict';

// Courses controller
  angular
    .module('library')
    .controller('LibrarySearchController', LibrarySearchController);

  LibrarySearchController.$inject = ['$scope', '$state', '$stateParams', '$window', 'Authentication', '$timeout', 'LibraryMediaService', 'Notification', 'GroupsService', 'treeUtils','_'];

  function LibrarySearchController($scope, $state, $stateParams, $window, Authentication, $timeout, LibraryMediaService, Notification, GroupsService,treeUtils, _) {
    var vm = this;
    vm.keyword = '';

    vm.mediasByKeyword = LibraryMediaService.byKeyword({keyword: $stateParams.keyword}, function() {
      vm.selectMedia = vm.mediasByKeyword;
    });

    vm.groups = GroupsService.listLibraryGroup(function() {
      vm.nodes = treeUtils.buildGroupTree(vm.groups);
      vm.nodeList = treeUtils.buildGroupListInOrder(vm.nodes);
    });

    vm.allMedias = LibraryMediaService.query(function() {
      vm.allMedias = _.filter(vm.allMedias, function(m) {
        return m.published;
      });
    });

    vm.getAllMedias = function() {
      vm.selectMedia = vm.allMedias;
    };

    vm.expand =  expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;
    vm.chooseSort = chooseSort;

    vm.optionCoures = [
      { value: 'asc', label: 'Sắp xếp theo tên a -> z' },
      { value: 'dsc', label: 'Sắp xếp theo tên z -> a' },
      { value: 'date', label: 'Săp xếp theo ngày' }
    ];
    vm.selectize_val_config = {
      maxItems: 1,
      valueField: 'value',
      labelField: 'label',
      create: false,
      placeholder: 'Choose...'
    };
    function toggleExpand(node) {
      node.data.mediumList = [];
      var childsNode = treeUtils.buildGroupListInOrder([node]);
      childsNode.map(function(child) {
        LibraryMediaService.byGroup({groupId:child.data._id},function(medium) {
          child.data.medium = _.filter(medium,function(media) {
            return media.published;
          });
        });
        if (child.data.medium && child.data.medium.length > 0) {
          node.data.mediumList = node.data.mediumList.concat(child.data.medium);
        }
      });

      if(node.data.mediumList.length > 0) {
        vm.selectMedia = node.data.mediumList;
        vm.sort = "asc";
      } else {
        vm.selectMedia = [];
      }
      if (node.children.length == 0)
        return;
      if (node.expand)
        collapse(node);
      else
        expand(node);
    }

    function expand(node) {
      treeUtils.expandCourseNode(node,true);
    }

    function collapse(node) {
      treeUtils.expandCourseNode(node,false);
    }

    function chooseSort(sort) {
      if(sort == "asc"){
        vm.sort = "name"
      }
      if(sort == "dsc"){
        vm.sort = "-name";
      }
      if(sort == "date"){
        vm.sort = "created";
      }
    }
  }
}());
