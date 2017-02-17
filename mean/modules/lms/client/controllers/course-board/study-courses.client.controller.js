(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudyController', CoursesStudyController);

CoursesStudyController.$inject = ['$scope', '$state', '$window', 'HtmlsService','ExamsService','VideosService','EditionSectionsService','Authentication','CourseAttemptsService', 'courseResolve', 'CoursesService', 'Notification', 'editionResolve','memberResolve','treeUtils', '$translate', '$q','_'];

function CoursesStudyController($scope, $state, $window, HtmlsService,ExamsService,VideosService,EditionSectionsService, Authentication, CourseAttemptsService,course, CoursesService, Notification, edition,member,treeUtils,$translate ,$q, _) {
    var vm = this;
    vm.course = course;
    vm.member = member;
    vm.edition = edition;
    vm.prevSection = prevSection;
    vm.nextSection = nextSection;
    vm.expand =  expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;
    
    vm.sections = EditionSectionsService.byEdition({editionId:vm.edition._id}, function() {
        vm.sections = _.filter(vm.sections,function(section) {
            return section.visible;
        });
        vm.nodes = treeUtils.buildCourseTree(vm.sections);
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
        
        vm.attempts = CourseAttemptsService.byCourseAndMember({editionId:vm.edition._id,memberId:vm.member._id},function() {
            _.each(vm.sections,function(section) {
                section.read = _.find(vm.attempts,function(attempt) {
                    return attempt.section == section._id && attempt.status=='completed';
                })
            })
        });
    });
    

    function selectContentNode(node) {
        vm.selectedContentNode = node;
        vm.section = node.data;
        if (node.data.contentType=='html')
            $state.go('workspace.lms.courses.join.study.html',{sectionId:node.data._id});
        if (node.data.contentType=='test')
            $state.go('workspace.lms.courses.join.study.quiz',{sectionId:node.data._id});
        if (node.data.contentType=='video')
            $state.go('workspace.lms.courses.join.study.video',{sectionId:node.data._id});
    }
    
    function toggleExpand(node) {
        if (vm.selectedNode != node) {
            vm.selectedNode = node;
            if (node.data.hasContent ) 
                selectContentNode(node);
        }
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
    
    function prevSection() {
        var index = 0;
        if (vm.selectedNode) {
            index = _.findIndex(vm.nodeList,function(node) {
                return node.id == vm.selectedNode.id;
            })-1;
            while (index >=0 && !vm.nodeList[index].data.hasContent)
                index--;
            if (index >=0) {
                vm.selectedNode = vm.nodeList[index];
                selectContentNode(vm.nodeList[index]);
            }
        }
        
    }
    
    function nextSection() {
        var index = 0;
        if (vm.selectedNode) {
            index = _.findIndex(vm.nodeList,function(node) {
                return node.id == vm.selectedNode.id;
            })+1;
            while (index <vm.nodeList.length && !vm.nodeList[index].data.hasContent)
                index++;
            if (index <vm.nodeList.length )  {
                vm.selectedNode = vm.nodeList[index];
                selectContentNode(vm.nodeList[index]);
            }
        }
    }
   
}
}());