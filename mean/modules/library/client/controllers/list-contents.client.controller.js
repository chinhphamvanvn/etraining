(function () {
    'use strict';

    angular
      .module('library')
      .controller('LibraryContentsListController', LibraryContentsListController);

    LibraryContentsListController.$inject = [ '$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'GroupsService','Upload', 'Notification','LibraryMediaService', 'treeUtils','$q','$translate', '_'];

    function LibraryContentsListController( $scope, $state, $stateParams, $timeout, $location, $window, GroupsService, Upload, Notification, LibraryMediaService, treeUtils,$q,$translate, _) {
      var vm = this;
      vm.createMediaItem = createMediaItem;
      vm.remove = remove;
      vm.finishEditLibTree = finishEditLibTree;

      vm.selectGroup = function(groups) {
          vm.group = groups;
          if (groups && groups.length)
              vm.medium = LibraryMediaService.byGroup({groupId:groups[0]})
      };

      function createMediaItem() {
          if (!vm.group || vm.group.length == 0) {
              UIkit.modal.alert($translate.instant('ERROR.LIBRARY.EMPTY_LIBRARY_GROUP'));
              return;
          }
          $state.go('admin.workspace.library.content.create',{group:vm.group})
      }

      function finishEditLibTree() {
          $window.location.reload();
      }

      function remove(item) {
              UIkit.modal.confirm('Are you sure?', function() {
                  vm.item.$remove(function() {
                      vm.medium = _.reject(vm.medium ,function(media) {
                          return media._id == item._id;
                      })
                  });
              });
      }

    }
  }());

