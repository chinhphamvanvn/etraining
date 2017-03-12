(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('groupTreeEdit', ['AdminService','LibraryMediaService','CoursesService','CompetenciesService', 'QuestionsService', 'GroupsService','$timeout','Notification','treeUtils','$translate','_', groupTreeEdit]);

  function groupTreeEdit(AdminService,LibraryMediaService,CoursesService, CompetenciesService, QuestionsService, GroupsService,$timeout,Notification,treeUtils,$translate, _) {
      
      return {
          scope: {
              treeId:"=",
              category:"=" // organization, question, library, competency ...
          },
          templateUrl:'/modules/shared/client/directives/group-tree-edit/group-tree-edit.directive.client.view.html',
          link: function (scope, element, attributes) {
              GroupsService.byCategory({category:scope.category}, function(groups) {
                  var tree = treeUtils.buildGroupTree(groups);
                  $timeout(function() {
                      $('#'+scope.treeId).fancytree({
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
                                  name: $translate.instant('ACTION.EDIT'),
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
                                  name: $translate.instant('ACTION.NEW_SIBLING'),
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
                                  name: $translate.instant('ACTION.NEW_CHILD'),
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
                                  name: $translate.instant('ACTION.DELETE'),
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

              
              scope.create = function(node) {
               // if not is null, then try to get the active node
                  if (!node) {
                      var tree = $('#'+scope.treeId).fancytree("getTree");
                      node = tree.getActiveNode();
                  }
                  UIkit.modal.prompt($translate.instant('MODEL.GROUP.NAME'), '', function(val){ 
                      val = val.trim();
                      if (!val) {
                          UIkit.modal.alert($translate.instant('ERROR.GROUP.EMPTY_NAME_NOT_ALLOW'));
                          return;
                      }                          
                      var group = new GroupsService();
                      group.name = val;
                      group.category = scope.category;
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
              
              scope.remove = function(node) {
                  // if not is null, then try to get the active node
                  if (!node) {
                      var tree = $('#'+scope.treeId).fancytree("getTree");
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
                  if (group.category=='organization')
                      AdminService.byGroup({groupId:group._id},function(users) {
                          if (users.length >0 ) {
                              UIkit.modal.alert($translate.instant('ERROR.GROUP_EDIT.REMOVE_UNEMPTY_ORG_GROUP'));
                          } else
                              group.$remove(function (response) {
                                  Notification.success({ message: '<i class="uk-icon-ok"></i> Group removed successfully!' });
                                  reloadTree();
                                 }, function (errorResponse) {
                                   Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group removed error!' });
                               });
                      });
                  if (group.category=='library')
                      LibraryMediaService.byGroup({groupId:group._id},function(contents) {
                          if (contents.length >0 ) {
                              UIkit.modal.alert($translate.instant('ERROR.LIBRARY.REMOVE_UNEMPTY_LIBRARY_GROUP'));
                          } else
                              group.$remove(function (response) {
                                  Notification.success({ message: '<i class="uk-icon-ok"></i> Group removed successfully!' });
                                  reloadTree();
                                 }, function (errorResponse) {
                                   Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group removed error!' });
                               });
                      });
                  if (group.category=='course')
                      CoursesService.byGroup({groupId:group._id},function(contents) {
                          if (contents.length >0 ) {
                              UIkit.modal.alert($translate.instant('ERROR.COURSE.REMOVE_UNEMPTY_COURSE_GROUP'));
                          } else
                              group.$remove(function (response) {
                                  Notification.success({ message: '<i class="uk-icon-ok"></i> Group removed successfully!' });
                                  reloadTree();
                                 }, function (errorResponse) {
                                   Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group removed error!' });
                               });
                      });
                  if (group.category=='question')
                      QuestionsService.byGroup({groupId:group._id},function(contents) {
                          if (contents.length >0 ) {
                              UIkit.modal.alert($translate.instant('ERROR.QUESTION.REMOVE_UNEMPTY_QUESTION_GROUP'));
                          } else
                              group.$remove(function (response) {
                                  Notification.success({ message: '<i class="uk-icon-ok"></i> Group removed successfully!' });
                                  reloadTree();
                                 }, function (errorResponse) {
                                   Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group removed error!' });
                               });
                      });
                  if (group.category=='competency')
                      CompetenciesService.byGroup({groupId:group._id},function(contents) {
                          if (contents.length >0 ) {
                              UIkit.modal.alert($translate.instant('ERROR.COMPETENCY.REMOVE_UNEMPTY_COMPETENCY_GROUP'));
                          } else
                              group.$remove(function (response) {
                                  Notification.success({ message: '<i class="uk-icon-ok"></i> Group removed successfully!' });
                                  reloadTree();
                                 }, function (errorResponse) {
                                   Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Group removed error!' });
                               });
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
              
              scope.rename =function(node) {
                  // if not is null, then try to get the active node
                  if (!node) {
                      var tree = $('#'+scope.treeId).fancytree("getTree");
                      node = tree.getActiveNode();
                  }
                  if (!node) {
                      Notification.error({ message:  '<i class="uk-icon-ban"></i> No node selected!' });
                      return;
                  }
                  UIkit.modal.prompt($translate.instant('MODEL.GROUP.NAME'), '', function(val){ 
                      val = val.trim();
                      if (!val) {
                          UIkit.modal.alert($translate.instant('ERROR.GROUP.EMPTY_NAME_NOT_ALLOW'));
                          return;
                      } 
                      var group = node.data;
                      if (node.parent)
                          group.parent = node.parent.id;
                      group.name = val;
                      updateGroup(group);
                   });
              }
              
              function reloadTree() {
                  GroupsService.byCategory({category:scope.category}, function(groups) {
                      var roots = treeUtils.buildGroupTree(groups);
                      var tree = $('#'+scope.treeId).fancytree("getTree");
                      tree.reload(roots);
                  });
              }
          }
      }
  }
}());
