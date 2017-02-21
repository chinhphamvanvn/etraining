(function () {
    'use strict';

    angular
      .module('library')
      .controller('LibraryContentsListController', LibraryContentsListController);

    LibraryContentsListController.$inject = [ '$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'GroupsService','Upload', 'Notification','LibraryMediaService', 'treeUtils','$q', '_'];

    function LibraryContentsListController( $scope, $state, $stateParams, $timeout, $location, $window, GroupsService, Upload, Notification, LibraryMediaService, treeUtils,$q, _) {
      var vm = this;
      vm.createMediaItem = createMediaItem;
      vm.remove = remove;
   
      vm.groups = GroupsService.listLibraryGroup( function() {
          var tree = treeUtils.buildGroupTree(vm.groups);
          $timeout(function() {
              $("#libTree").fancytree({
                  checkbox: false,
                  titlesTabbable: true,
                  selectMode:1,
                  clickFolderMode:3,
                  imagePath: "/assets/icons/others/",
                  extensions: ["wide", "childcounter"],
                  autoScroll: true,
                  generateIds: true,
                  source: tree,
                  toggleEffect: { effect: "blind", options: {direction: "vertical", scale: "box"}, duration: 200 },
                  childcounter: {
                    deep: true,
                    hideZeros: true,
                    hideExpanded: true
                  },
                  loadChildren: function(event, data) {
                      data.node.updateCounters();
                  },
                  activate: function(event, data) {
                      vm.selectedGroup =  data.node.data;
                      vm.medium = LibraryMediaService.byGroup({groupId:vm.selectedGroup._id},function() {
                      })
                  },
                 
              });
          });
     }); 


      
      function createMediaItem() {
          if (!vm.selectedGroup) {
              UIkit.modal.alert('Please select a group!');
              return;
          }
          $state.go('admin.workspace.library.content.create',{group:vm.selectedGroup._id})
           
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

