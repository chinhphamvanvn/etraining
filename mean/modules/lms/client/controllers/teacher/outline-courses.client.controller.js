(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesOutlineController', CoursesOutlineController);

CoursesOutlineController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve', 'Notification', 'CourseEditionsService', 'EditionSectionsService','treeUtils','_'];

function CoursesOutlineController($scope, $state, $window, Authentication, $timeout, edition, course, Notification, CourseEditionsService,EditionSectionsService , treeUtils, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.course = course;
    vm.addSection = addSection;
    vm.addUnit = addUnit;
    vm.addSubsection = addSubsection;
    vm.hasUnitSection = hasUnitSection;
    vm.editSection  = editSection ;
    vm.editVisible = editVisible;
    vm.removeSection = removeSection;
    vm.changePublishStatus = changePublishStatus;
    vm.expand = expand;
    vm.collapse = collapse;
    vm.expandAll = expandAll;
    vm.collapseAll = collapseAll;
    vm.validateParentNode = validateParentNode;
    vm.goUp = goUp;
    vm.goDown = goDown;
    vm.moveSection = moveSection;
    vm.sections = [];
    vm.expandMode = true;
    
    
    vm.sections = EditionSectionsService.byEdition({editionId:vm.edition._id}, function() {
        buildCourseTree();
    });
    
    function buildCourseTree(){
        vm.nodes = treeUtils.buildCourseTree(vm.sections);
        vm.expandMode = true;
        vm.nodeArray = treeUtils.buildCourseListInOrder(vm.nodes);
    }
    
    function changePublishStatus() {
        vm.edition.$update(function() {
            Notification.success({ message: '<i class="uk-icon-ok"></i> Course publish status change successfully!' });
        },function(errorResponse) {
            Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Course publish status change error!' });
        });
    } 
    
    function expandAll() {
        vm.expandMode = true;
        _.each(vm.nodes,function(node) {
            treeUtils.expandCourseNode(node,true)
        });
    }
    
    function collapseAll() {
        vm.expandMode = false;
        _.each(vm.nodes,function(node) {
            treeUtils.expandCourseNode(node,false)
        })
    }
    
    function expand(node) {
        treeUtils.expandCourseNode(node,true);
    }
    
    function collapse(node) {
        treeUtils.expandCourseNode(node,false);
    }

    function addSection() {
        UIkit.modal.prompt('Name:', '', function(val){ 
            var section = new EditionSectionsService();
            section.name = val;
            section.edition = vm.edition._id;
            section.hasContent = false;
            section.order = Math.max(vm.nodes.length + 1,_.max(vm.nodes, function(node){return node.order}));
            section.$save(function (response) {
                 Notification.success({ message: '<i class="uk-icon-ok"></i> Section created successfully!' });
                 vm.sections.push(section);
                 buildCourseTree();
                }, function (errorResponse) {
                  Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section created error!' });
              });
         });
    }
    
    function addSubsection(node) {
        UIkit.modal.prompt('Name:', '', function(val){ 
            var section = new EditionSectionsService();
            section.parent = node.data._id;
            section.name = val;
            section.edition = vm.edition._id;
            section.hasContent = false;
            section.order = Math.max(node.children.length + 1,_.max(node.children, function(child){return child.order}));
            section.$save(function (response) {
                 Notification.success({ message: '<i class="uk-icon-ok"></i> Section created successfully!' });
                 vm.sections.push(section);
                 buildCourseTree();
                }, function (errorResponse) {
                  Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section created error!' });
              });
         });
    }
    
    function hasUnitSection(node) {
        var unit = _.find(node.children,function(child) {
            return child.data.hasContent;
        });
        return unit != null;
    }
    
    function addUnit(node,contentType) {
        UIkit.modal.prompt('Name:', '', function(val){ 
            var section = new EditionSectionsService();
            section.parent = node.data._id;
            section.name = val;
            section.edition = vm.edition._id;
            section.hasContent = true;
            section.contentType =  contentType;
            section.order = Math.max(node.children.length + 1,_.max(node.children, function(child){return child.order}));
            section.$save(function (response) {
                 Notification.success({ message: '<i class="uk-icon-ok"></i> Section created successfully!' });
                 vm.sections.push(section);
                 buildCourseTree();
                }, function (errorResponse) {
                  Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section created error!' });
              });
         });
    }
    
    function editSection(node) {
        var section = node.data;
        if (section.hasContent) {
            if (section.contentType=='html')
                $state.go('workspace.lms.courses.section.edit.html',{courseId:vm.edition.course,sectionId:node.data._id});
            if (section.contentType=='test')
                $state.go('workspace.lms.courses.section.edit.quiz',{courseId:vm.edition.course,sectionId:node.data._id});
            if (section.contentType=='video')
                $state.go('workspace.lms.courses.section.edit.video',{courseId:vm.edition.course,sectionId:node.data._id});
        }
        else
            UIkit.modal.prompt('Name:', '', function(val){ 
            section.name = val;
            section.$update(function () {
               }, function (errorResponse) {
                 Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
             });
        });
    }
    
    function editVisible(node) {
        var section = node.data;
        section.$update(function () {
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
         });
    }
    
    function goUp(node) {
        if (node.index -1 < 0)
            return;
        var siblings = node.parent ? node.parent.children : vm.nodes;
        var prevNode = _.find(siblings,function(n) {
            return n.index == node.index-1;
        });
        var section = node.data;
        var currentOrder = section.order;
        section.order = prevNode.data.order;
        prevNode.data.order = currentOrder;
        section.$update(function () {
            prevNode.data.$update(function() {
                buildCourseTree();
            }, function(errorResponse) {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
                $window.location.reload();
            })
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
         });
        
    }
    
    function goDown(node) {
        var section = node.data;
        var siblings = node.parent ? node.parent.children : vm.nodes;
        if (node.index +1 >= siblings.length)
            return;
        var nextNode = _.find(siblings,function(n) {
            return n.index == node.index +1;
        });
        var currentOrder = section.order;
        section.order = nextNode.data.order;
        nextNode.data.order = currentOrder;
        section.$update(function () {
            nextNode.data.$update(function() {
                buildCourseTree();
            }, function(errorResponse) {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
                $window.location.reload();
            })
           }, function (errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
         });
        
    }
    
    function moveSection(node, newParentNode) {
        var section = node.data;
        section.parent = newParentNode.data._id;
        section.order = Math.max(newParentNode.children.length + 1,_.max(newParentNode.children, function(child){return child.order}));
        section.$update(function () {
            buildCourseTree();
            }, function(errorResponse) {
                Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section updated error!' });
            });
    }
    
    function validateParentNode(node, parentNode) {
        if (node.id == parentNode.id)
            return false;
        if (node.parent && node.parent.id == parentNode.id)
            return false;
        if (parentNode.data.hasContent)
            return false;
        var parent = parentNode.parent;
        while (parent) {
            if (parent.id == node.id)
                return false;
            parent = parent.parent;
        }
        if (node.data.hasContent) {
            var contentNode = _.find(parentNode.children,function(childNode) {
                return childNode.data.hasContent;
            });
            if (contentNode == null && parentNode.children.length>0)
                return false;
        }
        if (!node.data.hasContent) {
            var contentNode = _.find(parentNode.children,function(childNode) {
                return childNode.data.hasContent;
            });
            if (contentNode)
                return false;
        }
        return true;
    }
    
    function removeSection(node) {
        var section = node.data;
        if (node.children.length>0) {
            Notification.error({ message: '<i class="uk-icon-ban"></i> Section not empty!' });
            return;
        }
        section.$remove(function (response) {
            $window.location.reload();
            }, function (errorResponse) {
              Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Section removed error!' });
          });
    }

}
}());