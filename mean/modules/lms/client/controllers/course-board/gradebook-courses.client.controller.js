(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesGradebookController', CoursesGradebookController);

CoursesGradebookController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve','memberResolve', 'Notification', 'ExamsService','EditionSectionsService', 'CourseAttemptsService','treeUtils', '_'];

function CoursesGradebookController($scope, $state, $window, Authentication, $timeout, edition, course, member, Notification, ExamsService, EditionSectionsService,CourseAttemptsService ,treeUtils, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    
    vm.attempts = CourseAttemptsService.byCourseAndMember({editionId:edition._id,memberId:member._id},function() {
        var groupBySection = _.groupBy(vm.attempts, 'section');
    });
    vm.sections = EditionSectionsService.byEdition({editionId:vm.edition._id}, function() {
        vm.sections = _.filter(vm.sections,function(section) {
            return section.visible;
        });
        vm.nodes = treeUtils.buildCourseTree(vm.sections);
        _.each(vm.nodes,function(node) {
            node.childList = _.filter(treeUtils.buildCourseListInOrder(node.children),function(node) {
               return node.data.hasContent && node.data.contentType=='test'; 
            });
            _.each(node.childList,function(node) {
                if (node.data.quiz) {
                    node.data.quiz = ExamsService.get({examId:node.data.quiz},function(quiz) {
                        
                    });
                }
            });
            
        });
        
    });
}
}());