(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('LmsCoursesListController', LmsCoursesListController);

  LmsCoursesListController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'CoursesService', 'Notification', 'GroupsService', 
  '$q', '_', 'treeUtils', 'userResolve', 'CourseProgramsService'];

  function LmsCoursesListController($scope, $state, $window, Authentication, $timeout, CoursesService, Notification, GroupsService, 
    $q, _, treeUtils, user, CourseProgramsService) {
    var vm = this;
    vm.keyword = '';
    vm.user = user;
    var listProgramsByGroupId;

    vm.gotoSearch = function() {
      if (!vm.keyword.trim()) return;

      $state.go('workspace.lms.courses.search', {
        keyword: vm.keyword
      });
    };
    CourseProgramsService.programsByGroup({
      groupId: vm.user.group
    }, function(programs) {
      listProgramsByGroupId = programs;
    });

    vm.groups = GroupsService.listCourseGroup(function() {
      _.each(vm.groups, function(group) {
        group.courses = CoursesService.byGroup({
          groupId: group._id
        });
      });

      CoursesService.listPublic(function(courses) {
        vm.fullCourses = courses;
        vm.selectedCourse = courses;
        vm.sort = 'asc';
      });

      vm.nodes = treeUtils.buildCourseTree(vm.groups);
      _.each(vm.nodes, function(node) {
        treeUtils.expandCourseNode(node, false);
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
    vm.selectCourse = selectCourse;
    vm.expand = expand;
    vm.collapse = collapse;
    vm.toggleExpand = toggleExpand;
    vm.chooseSort = chooseSort;
    vm.selsetAll = selsetAll;
    vm.selectOrganization = selectOrganization;

    vm.optionCoures = [
      {
        value: 'asc',
        label: 'Sắp xếp theo tên a -> z'
      },
      {
        value: 'dsc',
        label: 'Sắp xếp theo tên z -> a'
      },
      {
        value: 'date',
        label: 'Săp xếp theo ngày bắt đầu khóa học'
      }
    ];
    vm.selectize_val_config = {
      maxItems: 1,
      valueField: 'value',
      labelField: 'label',
      create: false,
      placeholder: 'Choose...'
    };
    function toggleExpand(node) {
      node.data.coursesList = [];
      vm.group = [node.data._id];
      var courses = [];
      var childsNode = treeUtils.buildGroupListInOrder([node]);
      childsNode.forEach(function(child) {
        CoursesService.byGroup({
          groupId: child.data._id
        }, function(courses) {
          child.data.courses = _.filter(courses, function(course) {
            return course.status === 'available' && course.enrollStatus && course.displayMode !== 'enroll';
          });
        });
        if (child.data.courses && child.data.courses.length > 0) {
          courses = courses.concat(child.data.courses);
        }
      });
      node.data.coursesList = courses;

      if (node.data.coursesList.length > 0) {
        vm.selectedCourse = node.data.coursesList;
        vm.sort = 'asc';
      } else {
        vm.selectedCourse = [];
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

    function chooseSort(sort) {
      if (sort === 'asc') {
        vm.sort = 'name';
      }
      if (sort === 'dsc') {
        vm.sort = '-name';
      }
      if (sort === 'date') {
        vm.sort = 'startDate';
      }
    }

    function selectCourse(course) {
      vm.selectedCourse = course;
    }

    function selsetAll() {
      vm.group = '';
      vm.selectedCourse = vm.fullCourses;
    }

    function selectOrganization() {
      vm.group = 'organization';
      vm.selectedCourse = [];
      if (listProgramsByGroupId && listProgramsByGroupId.length > 0) {
        listProgramsByGroupId.forEach(function(program) {
          vm.selectedCourse = vm.selectedCourse.concat(program.courses);
        });
      }
    }
  }
}());
