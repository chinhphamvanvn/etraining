(function () {
  'use strict';

  angular
  .module('shared')
    .service('treeUtils', ['_',
        function (_) {
            return {
              
                // build tree
                buildGroupTree: function(groups) {
                    function buildTopDownTree(rootId,root) {
                        var childGroups = _.filter(groups,function(group) {
                            return group.parent == rootId;
                        });
                        var fullTitle = root ? root.fullTitle :'';
                        var childNodes = _.map(childGroups,function(obj) {
                            return {title:obj.name, folder:true, fullTitle:fullTitle+obj.name+' / ', expanded:true, key: obj._id, children:[], data: obj}; 
                        });        
                        _.each(childNodes, function(childNode) {
                            childNode.children =  buildTopDownTree(childNode.key,childNode);
                            childNode.parent = root;
                         });
                         return childNodes;
                    }
                    return buildTopDownTree(null,null);
                },
                buildGroupListInOrder: function(nodes) {
                    function buildInOrderList(parentNode) {
                        var nodeList = [];
                        nodeList.push(parentNode);
                        _.each(parentNode.children,function(childNode) {
                            nodeList = nodeList.concat(buildInOrderList(childNode));
                        });
                         return nodeList;
                    }
                    var list = [];
                    _.each(nodes,function(node) {
                        list = list.concat(buildInOrderList(node));
                    });
                    return list;
                },
                findGroupNode:function(treeNodes, key) {
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
                },
                buildCourseTree: function(sections) {
                    function buildTopDownTree(rootId,root) {
                        var childSections = _.filter(sections,function(section) {
                            return section.parent == rootId;
                        });
                        childSections = _.sortBy(childSections,'order');
                        var rootTitle = root ? root.title :'';
                        var childNodes = _.map(childSections,function(obj) {
                            return {data:obj, expand:true,title:rootTitle+obj.name+' / ', id:obj._id}; 
                        });
                        _.each(childNodes, function(childNode, index) {
                            childNode.children =  buildTopDownTree(childNode.data._id,childNode);
                            childNode.parent = root;
                            childNode.index = index;
                         });
                         return childNodes;
                    }
                    return buildTopDownTree(null,null);
                },
                expandCourseNode:function(rootNode, expandMode) {
                    function setExpandMode(node,expandMode) {
                        node.expand = expandMode;
                        _.each( node.children, function(child) {
                            setExpandMode(child,expandMode);
                        });
                    }
                    setExpandMode(rootNode,expandMode);
                },
                buildCourseListInOrder: function(nodes) {
                    function buildInOrderList(parentNode) {
                        var nodeList = [];
                        nodeList.push(parentNode);
                        _.each(parentNode.children,function(childNode) {
                            nodeList = nodeList.concat(buildInOrderList(childNode));
                        });
                         return nodeList;
                    }
                    var list = [];
                    _.each(nodes,function(node) {
                        list = list.concat(buildInOrderList(node));
                    });
                    return list;
                },
                
            };
        }]
    )
}());