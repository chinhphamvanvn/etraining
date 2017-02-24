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
        var nodes = treeUtils.buildGroupTree(vm.groups);
        vm.nodeList = treeUtils.buildGroupListInOrder(nodes);
        _.each(vm.nodeList,function(node) {
            LibraryMediaService.byGroup({groupId:node.data._id},function(medium) {
                node.data.medium = _.filter(medium,function(media) {
                    return media.published;
                })
            });
        });
    });

    // function selectGroup(node) {
    //     LibraryMediaService.byGroup({groupId:node.data._id},function(medium) {
    //         node.data.medium = _.filter(medium,function(media) {
    //             return media.published;
    //         })
    //     });
    // }

}
}());