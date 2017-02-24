(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('LmsCoursesListController', LmsCoursesListController);

LmsCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification', 'GroupsService', '$q','_','treeUtils'];

function LmsCoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, GroupsService,$q, _, treeUtils) {
    var vm = this;
    vm.groups = GroupsService.listCourseGroup(function() {
        _.each(vm.groups,function(group) {
            group.courses = CoursesService.byGroup({groupId:group._id});
        })
        _.each(vm.groups,function(group) {
            CoursesService.byGroup({groupId:group._id},function(courses) {
                group.courses = _.filter(courses,function(course) {
                    return course.status =='available' && course.enrollStatus && course.displayMode !='enroll'
                })
            });
        });

        vm.nodes = treeUtils.buildCourseTree(vm.groups);
        _.each(vm.nodes,function(node) {
            treeUtils.expandCourseNode(node,false);
        });
        vm.nodeList = treeUtils.buildCourseListInOrder(vm.nodes);
        if ($state.params.sectionId) {
            vm.selectedNode = _.find(vm.nodeList,function(node){
                return node.data._id == $state.params.sectionId; 
            });
            if (vm.selectedNode) {
                var parentNode = vm.selectedNode.parent;
                while (parentNode.parent)
                    parentNode = parentNode.parent;
                expand(parentNode);
                if (vm.selectedNode.data.hasContent)
                    vm.selectedContentNode =  vm.selectedNode;
            }
        }
    });
    vm.selectGroup = selectGroup;
    vm.selectCourse = selectCourse;
    vm.expand =  expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;

    function selectContentNode(node) {
        vm.selectedNode = node;
        vm.selectedContentNode = node;
        vm.section = node.data;
        console.log(node);
        // if (node.data.contentType=='html')
        //     $state.go('workspace.lms.courses.outline.preview.html',{sectionId:node.data._id});
        // if (node.data.contentType=='test')
        //     $state.go('workspace.lms.courses.outline.preview.quiz',{sectionId:node.data._id});
        // if (node.data.contentType=='video')
        //     $state.go('workspace.lms.courses.outline.preview.video',{sectionId:node.data._id});
        // if (node.data.contentType=='survey')
        //     $state.go('workspace.lms.courses.outline.preview.survey',{sectionId:node.data._id});
    }

    function toggleExpand(node) {
        console.log(node);
        // if (vm.selectedNode != node) {
        //     vm.selectedNode = node;
        //     if (node.data.hasContent )
        //         selectContentNode(node);
        // }
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

    function selectGroup(group) {
        // CoursesService.byGroup({groupId:group._id},function(courses) {
        //     group.courses = _.filter(courses,function(course) {
        //         return course.status =='available' && course.enrollStatus && course.displayMode !='enroll'
        //     });
        // });
        vm.selectedCourse = group.courses;
        console.log(vm.selectedCourse);

    }
    
    function selectCourse(course) {
        vm.selectedCourse = course;
    }
}
}());