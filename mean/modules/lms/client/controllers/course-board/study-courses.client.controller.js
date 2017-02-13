(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudyController', CoursesStudyController);

CoursesStudyController.$inject = ['$scope', '$state', '$window', 'CourseMembersService','Authentication', 'EditionSectionsService', 'courseResolve', 'CoursesService', 'Notification', 'editionResolve','treeUtils', '$translate', '$q','_'];

function CoursesStudyController($scope, $state, $window, CourseMembersService,Authentication, EditionSectionsService, course, CoursesService, Notification, edition,treeUtils,$translate ,$q, _) {
    var vm = this;
    vm.course = course;
    vm.expand =  expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;
    vm.edition = edition;
    vm.sections = EditionSectionsService.byEdition({editionId:vm.edition._id}, function() {
        vm.sections = _.filter(vm.sections,function(section) {
            return section.visible;
        })
        vm.nodes = treeUtils.buildCourseTree(vm.sections);
        _.each(vm.nodes,function(node) {
            treeUtils.expandCourseNode(node,false);
        })
     
    });
    
    function toggleExpand(node) {
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
    
   
}
}());