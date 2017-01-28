(function () {
  'use strict';

  angular
  .module('shared')
    .service('treeUtils', ['_',
        function (_) {
            return {
              
                // build tree
                buildTree: function(groups,rootId) {
                    function buildTopDownTree(rootId) {
                        var childGroups = _.filter(groups,function(group) {
                            return group.parent == rootId;
                        });
                        var childNodes = _.map(childGroups,function(obj) {
                            return {title:obj.name, folder:true, expanded:true, key: obj._id, children:[], data: obj}; 
                        });        
                        _.each(childNodes, function(childNode) {
                            childNode.children =  buildTopDownTree(childNode.key);
                         });
                         return childNodes;
                    }
                    return buildTopDownTree(null);
                },
                findNode:function(treeNodes, key) {
                    var found = null;
                    function find(node,key) {
                        if (node.key == key)
                            found =  node;
                        for (var i = 0; i < node.children.length && !found ;i++) {
                            find(node.children[i],key);
                        }
                    }
                    _.each(treeNodes,function(treeNode) {
                        find(treeNode,key);
                    });
                    return found;
                }
               
            };
        }]
    )
}());