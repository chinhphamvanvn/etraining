(function () {
    'use strict';

    angular
      .module('lms')
      .controller('CoursesStudyController', CoursesStudyController);

    CoursesStudyController.$inject = [ '$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'GroupsService', 'Notification', 'treeUtils', '_'];

    function CoursesStudyController( $scope, $state, $stateParams, $timeout, $location, $window, GroupsService, Notification, treeUtils, _) {
      var vm = this;
      vm.create = create;
      vm.remove = remove;
      vm.rename = rename;
   
      vm.groups = GroupsService.listCourseGroup( function() {
          var tree = treeUtils.buildTree(vm.groups);
          $timeout(function() {
              $("#orgTree").fancytree({
                  checkbox: false,
                  titlesTabbable: true,
                  selectMode:1,
                  clickFolderMode:3,
                  imagePath: "/assets/icons/others/",
                  extensions: ["dnd", "wide", "childcounter", "edit"],
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
                  },
                  dnd: {
                      autoExpandMS: 400,
                      focusOnClick: true,
                      preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                      preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                      dragStart: function(node, data) {
                        /** This function MUST be defined to enable dragging for the tree.
                         *  Return false to cancel dragging of node.
                         */
                        return true;
                      },
                      dragEnter: function(node, data) {
                        /** data.otherNode may be null for non-fancytree droppables.
                         *  Return false to disallow dropping on node. In this case
                         *  dragOver and dragLeave are not called.
                         *  Return 'over', 'before, or 'after' to force a hitMode.
                         *  Return ['before', 'after'] to restrict available hitModes.
                         *  Any other return value will calc the hitMode from the cursor position.
                         */
                         return true;
                      },
                      dragDrop: function(node, data) {
                        /** This function MUST be defined to enable dropping of items on
                         *  the tree.
                         */
                        data.otherNode.moveTo(node, data.hitMode);
                        var group = data.otherNode.data;
                        group.parent = node.key;
                        updateGroup(group);
                      }
                    },
                    edit: {
                        triggerStart: ["dblclick"],
                        close: function(event, data) {
                          if( data.save && !data.isNew ){
                              var group =  data.node.data;
                              group.name = data.node.title;
                              updateGroup(group);
                          }
                        }
                      },
              });
              
              var cm_items_text = {
                      'edit': {
                          name: "Edit",
                          icon: function(opt, $itemElement, itemKey, item){
                              $itemElement.html('<i class="material-icons">&#xE254;</i> ' + item.name);
                              return 'context-menu-material';
                          },
                          callback: function(itemKey, opt){
                              var node = $.ui.fancytree.getNode(opt.$trigger);
                              rename(node);
                              return true;             
                          }  
                      },
                      'clone': {
                          name: "New sibling",
                          icon: function(opt, $itemElement, itemKey, item){
                              $itemElement.html('<i class="material-icons">repeat_one</i> ' + item.name);
                              return 'context-menu-material';
                          },
                          callback: function(itemKey, opt){
                              var node = $.ui.fancytree.getNode(opt.$trigger);
                              create(node.parent);
                              return true;             
                          }  
                      },
                      'child': {
                          name: "New child",
                          icon: function(opt, $itemElement, itemKey, item){
                              $itemElement.html('<i class="material-icons">open_in_new</i> ' + item.name);
                              return 'context-menu-material';
                          },
                          callback: function(itemKey, opt){
                              var node = $.ui.fancytree.getNode(opt.$trigger);
                              create(node);
                              return true;             
                          }  
                      },
                      "sep1": "---------",
                      'delete': {
                          name: "Delete",
                          icon: function(opt, $itemElement, itemKey, item){
                              $itemElement.html('<i class="material-icons">&#xE872;</i> ' + item.name);
                              return 'context-menu-material md-color-red-600';
                          },
                          callback: function(itemKey, opt){
                              var node = $.ui.fancytree.getNode(opt.$trigger);
                              remove(node);
                              return true;             
                          } 
                      }
                  };
                  $.contextMenu({
                      selector: 'span.fancytree-node',
                      autoHide: true,
                      items: cm_items_text,
                     
                  });
          });
     }); 

      
      function create(node) {
       // if not is null, then try to get the active node
          if (!node) {
              var tree = $("#orgTree").fancytree("getTree");
              node = tree.getActiveNode();
          }
          UIkit.modal.prompt('Name:', '', function(val){ 
              var group = new GroupsService();
              group.name = val;
              group.category ='course';
              if (node)
                  group.parent = node.key;
               group.$save(function (response) {
                   Notification.success({ message: '<i class="uk-icon-ok"></i> Group created successfully!' });
                   reloadTree();
                  }, function (errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group created error!' });
                });
           });
      }
      
      function remove(node) {
          // if not is null, then try to get the active node
          if (!node) {
              var tree = $("#orgTree").fancytree("getTree");
              node = tree.getActiveNode();
          }
          if (!node) {
              Notification.error({ message:  '<i class="uk-icon-ban"></i> No node selected!' });
              return;
          }
          if (node.children) {
              Notification.error({ message:  '<i class="uk-icon-ban"></i> Cannot remove non-empty node!' });
              return;
          }
          var group = node.data;
          group.$remove(function (response) {
               Notification.success({ message: '<i class="uk-icon-ok"></i> Group removed successfully!' });
               reloadTree();
              }, function (errorResponse) {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group removed error!' });
            });
      }
      
      function updateGroup(group) {
          group.$update(function (response) {
              Notification.success({ message: '<i class="uk-icon-ok"></i> Group created successfully!' });
              reloadTree();
             }, function (errorResponse) {
               Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group created error!' });
           });
      }
      
      function rename(node) {
          // if not is null, then try to get the active node
          if (!node) {
              var tree = $("#orgTree").fancytree("getTree");
              node = tree.getActiveNode();
          }
          if (!node) {
              Notification.error({ message:  '<i class="uk-icon-ban"></i> No node selected!' });
              return;
          }
          UIkit.modal.prompt('Name:', '', function(val){ 
              var group = node.data;
              group.name = val;
              updateGroup(group);
           });
      }
      
      function reloadTree() {
          vm.groups = GroupsService.listCourseGroup( function() {
              var roots = treeUtils.buildTree(vm.groups);
              var tree = $("#orgTree").fancytree("getTree");
              tree.reload(roots);
          });
      }

    }
  }());

