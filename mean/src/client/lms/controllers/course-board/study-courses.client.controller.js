(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStudyController', CoursesStudyController);

  CoursesStudyController.$inject = ['$scope', '$state', '$window', 'HtmlsService', 'ExamsService', 'VideosService', 'EditionSectionsService', 'Authentication', 'AttemptsService', 'courseResolve', 'CoursesService', 'Notification', 'editionResolve', 'memberResolve', 'treeUtils', '$translate', '$q', '_'];

  function CoursesStudyController($scope, $state, $window, HtmlsService, ExamsService, VideosService, EditionSectionsService, Authentication, AttemptsService, course, CoursesService, Notification, edition, member, treeUtils, $translate, $q, _) {
    var vm = this;
    vm.course = course;
    vm.member = member;
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

      vm.attempts = AttemptsService.byMember({
        memberId: vm.member._id
      }, function() {
        _.each(vm.sections, function(section) {
          section.read = _.find(vm.attempts, function(attempt) {
            return attempt.section === section._id && attempt.status === 'completed';
          });
        });
        var latestAttempt = _.max(vm.attempts, function(attempt) {
          return new Date(attempt.start).getTime();
        });
        if (vm.attempts.length) {
          var lastNode = _.find(vm.nodeList, function(node) {
            return node.data._id === latestAttempt.section._id;
          });
          if (lastNode) {
            selectNode(lastNode);
          }
        }
      });
    });


    function selectContentNode(node) {
      vm.selectedNode = node;
      vm.selectedContentNode = node;
      vm.section = node.data;
      var index = _.findIndex(vm.nodeList, function(node) { return node.id === vm.selectedNode.id;}) + 1;

      if (node.data.contentType === 'html')
        $state.go('workspace.lms.courses.join.study.html', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'test')
        $state.go('workspace.lms.courses.join.study.quiz', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'video')
        $state.go('workspace.lms.courses.join.study.video', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'survey')
        $state.go('workspace.lms.courses.join.study.survey', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'exercise')
        $state.go('workspace.lms.courses.join.study.exercise', {
          sectionId: node.data._id
        });
      if (node.data.contentType === 'practice')
        $state.go('workspace.lms.courses.join.study.practice', {
          sectionId: node.data._id
        });
    }

    function toggleExpand(node) {
      if (vm.selectedNode !== node) {
        selectNode(node);
      }
      if (node.children.length === 0)
        return;
      if (node.expand)
        collapse(node);
      else
        expand(node);
    }

    function selectNode(node) {
      vm.selectedNode = node;
      var parentNode = vm.selectedNode.parent;
      while (parentNode && parentNode.parent)
        parentNode = parentNode.parent;
      expand(parentNode);
      if (vm.selectedNode.data.hasContent)
        selectContentNode(vm.selectedNode);
    }

    function expand(node) {
      treeUtils.expandCourseNode(node, true);
    }

    function collapse(node) {
      treeUtils.expandCourseNode(node, false);
    }

    function prevSection() {
      var index = 0;
      if (vm.selectedNode) {
        index = _.findIndex(vm.nodeList, function(node) { return node.id === vm.selectedContentNode.id; }) - 1;
        while (index >= 0 && !vm.nodeList[index].data.hasContent)
          index--;
        if (index >= 0) {
          vm.selectedNode = vm.nodeList[index];
          selectContentNode(vm.nodeList[index]);
        }
      }
    }

    function nextSection() {
      var index = 0;
      if (vm.selectedNode) {
        index = _.findIndex(vm.nodeList, function(node) { return node.id === vm.selectedContentNode.id; }) + 1;
        while (index < vm.nodeList.length && !vm.nodeList[index].data.hasContent)
          index++;
        if (index < vm.nodeList.length) {
          vm.selectedNode = vm.nodeList[index];
          selectContentNode(vm.nodeList[index]);
        } else
          UIkit.modal.alert($translate.instant('ALERT.COURSE.COMPLETE'));
      }
    }

  }
}(window.UIkit));
