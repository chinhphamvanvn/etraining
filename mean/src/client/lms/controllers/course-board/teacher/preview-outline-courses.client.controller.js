(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesOutlinePreviewController', CoursesOutlinePreviewController);

  CoursesOutlinePreviewController.$inject = ['$scope', '$state', '$window', 'HtmlsService', 'ExamsService', 'VideosService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'courseResolve', 'CoursesService', 'Notification', 'editionResolve', 'treeUtils', '$translate', '$q', '_'];

  function CoursesOutlinePreviewController($scope, $state, $window, HtmlsService, ExamsService, VideosService, EditionSectionsService, Authentication, AttemptsService, course, CoursesService, Notification, edition, treeUtils, $translate, $q, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.prevSection = prevSection;
    vm.nextSection = nextSection;
    vm.expand = expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;

    vm.sections = EditionSectionsService.byEdition({
      editionId: vm.edition._id
    }, function() {
      vm.sections = _.filter(vm.sections, function(section) {
        return section.visible;
      });
      vm.nodes = treeUtils.buildCourseTree(vm.sections);
      _.each(vm.nodes, function(node) {
        treeUtils.expandCourseNode(node, true);
      });
      vm.nodeList = treeUtils.buildCourseListInOrder(vm.nodes);
      if ($state.params.sectionId) {
        vm.selectedNode = _.find(vm.nodeList, function(node) {
          return node.data._id === $state.params.sectionId;
        });
        if (vm.selectedNode) {
          var parentNode = vm.selectedNode.parent;
          while (parentNode.parent)
            parentNode = parentNode.parent;
          expand(parentNode);
          if (vm.selectedNode.data.hasContent)
            vm.selectedContentNode = vm.selectedNode;
        }
      }

    });


    function selectContentNode(node) {
      vm.selectedNode = node;
      vm.selectedContentNode = node;
      vm.section = node.data;
      if (node.data.contentType === 'html')
        $state.go('workspace.lms.courses.outline.preview.html', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'scorm')
          $state.go('workspace.lms.courses.outline.preview.scorm', {
            sectionId: node.data._id
          });
      if (node.data.contentType === 'test')
        $state.go('workspace.lms.courses.outline.preview.quiz', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'video')
        $state.go('workspace.lms.courses.outline.preview.video', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'survey')
        $state.go('workspace.lms.courses.outline.preview.survey', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'exercise')
        $state.go('workspace.lms.courses.outline.preview.exercise', {
          sectionId: node.data._id
        });
    }

    function toggleExpand(node) {
      if (vm.selectedNode !== node) {
        vm.selectedNode = node;
        if (node.data.hasContent)
          selectContentNode(node);
      }
      if (node.children.length === 0)
        return;
      if (node.expand)
        collapse(node);
      else
        expand(node);
    }

    function expand(node) {
      treeUtils.expandCourseNode(node, true);
    }

    function collapse(node) {
      treeUtils.expandCourseNode(node, false);
    }

    function prevSection() {
      var index = 0;
      if (vm.selectedContentNode) {
        index = _.findIndex(vm.nodeList, function(node) { return node.id === vm.selectedContentNode.id; }) - 1;
        while (index >= 0 && !vm.nodeList[index].data.hasContent)
          index--;
        if (index >= 0)
          selectContentNode(vm.nodeList[index]);
      }
    }

    function nextSection() {
      var index = 0;
      if (vm.selectedContentNode) {
        index = _.findIndex(vm.nodeList, function(node) { return node.id === vm.selectedContentNode.id;}) + 1;
        while (index < vm.nodeList.length && !vm.nodeList[index].data.hasContent)
          index++;
        if (index < vm.nodeList.length)
          selectContentNode(vm.nodeList[index]);
      }
    }

  }
}());
