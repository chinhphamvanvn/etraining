(function() {
    'use strict';

// Courses controller
angular
    .module('library')
    .controller('LibraryController', LibraryController);

LibraryController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'LibraryMediaService', 'Notification', 'GroupsService', 'treeUtils','_'];

function LibraryController($scope, $state, $window, Authentication, $timeout, LibraryMediaService, Notification, GroupsService,treeUtils, _) {
    var vm = this;
    // vm.selectGroup = selectGroup;

    vm.groups = GroupsService.listLibraryGroup(function() {
        vm.nodes = treeUtils.buildGroupTree(vm.groups);
        vm.nodeList = treeUtils.buildGroupListInOrder(vm.nodes);
        _.each(vm.nodeList,function(node) {
            LibraryMediaService.byGroup({groupId:node.data._id},function(medium) {
                node.data.medium = _.filter(medium,function(media) {
                    return media.published;
                })
            });
        });
    });

    vm.expand =  expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;

    function toggleExpand(node) {
        console.log(node);
        node.data.mediumList = [];
        var medium = [];
        var childsNode = treeUtils.buildGroupListInOrder([node]);
        childsNode.map(function(child) {
            if (child.data.medium.length > 0) {
              medium = medium.concat(child.data.medium);
            }
        });
        node.data.mediumList = medium;

        if(node.data.mediumList.length > 0) {
            vm.selectMedia = node.data.mediumList;
            vm.sort = "asc";
        } else {
            vm.selectedCourse = [];
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

    // function selectGroup(node) {
    //     LibraryMediaService.byGroup({groupId:node.data._id},function(medium) {
    //         node.data.medium = _.filter(medium,function(media) {
    //             return media.published;
    //         })
    //     });
    // }

}
}());