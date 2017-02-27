(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('groupTreeView', ['GroupsService','$timeout','treeUtils','_', groupTreeView]);

  function groupTreeView(GroupsService,$timeout,treeUtils,_) {
      
      return {
          scope: {
              treeId:"=",
              category:"=", // organization, question, library, competency ...
              mode:"=", // multiple or single
              select:"=",
              disabled:"=",
              initial:"="   // id of initial selected noded
          },
          templateUrl:'/modules/shared/client/directives/group-tree-view/group-tree-view.directive.client.view.html',
          link: function (scope, element, attributes) {
              GroupsService.byCategory({category:scope.category}, function(groups) {
                  var tree = treeUtils.buildGroupTree(groups);
                  if (scope.initial) {
                      var selectNode = treeUtils.findGroupNode(tree, scope.initial);
                      selectNode.selected = true;
                  }
                  $timeout(function() {
                      $('#'+scope.treeId).fancytree({
                          checkbox: true,
                          titlesTabbable: true,
                          selectMode:scope.mode=='single'? 1:3,
                          clickFolderMode:3,
                          imagePath: "/assets/icons/others/",
                          extensions: ["wide"],
                          autoScroll: true,
                          generateIds: true,
                          disabled:scope.disabled,
                          source: tree,
                          toggleEffect: { effect: "blind", options: {direction: "vertical", scale: "box"}, duration: 200 },
                          select: function(event, data) {
                              scope.$apply(function() {
                                  var nodeIds = _.map( data.tree.getSelectedNodes(), function(obj) {
                                      return obj.data._id;
                                  });
                                  if (scope.select)
                                      scope.select(nodeIds);
                              });
                          }
                      });
                  });
             }); 
          }
      }
  }
}());
