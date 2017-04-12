(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('cms')
    .controller('CoursesController', CoursesController);

  CoursesController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'CoursesService', 'Notification', 'GroupsService', 'Upload', 'CompetenciesService', 'fileManagerConfig', '$translate', '_'];

  function CoursesController($scope, $state, $window, Authentication, $timeout, course, CoursesService, Notification, GroupsService, Upload, CompetenciesService, fileManagerConfig, $translate, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.course = course;
    vm.error = null;
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.activate = activate;
    vm.deactivate = deactivate;
    vm.tinymce_options = fileManagerConfig;
    var $courseValidate = $('#courseForm');

    $courseValidate
      .parsley()
      .on('form:validated', function() {
        $scope.$apply();
      })
      .on('field:validated', function(parsleyField) {
        if ($(parsleyField.$element).hasClass('md-input')) {
          $scope.$apply();
        }
      });

    vm.prequisites = _.pluck(vm.course.prequisites,'_id');
    vm.prequisiteConfig = {
      plugins: {
        'remove_button': {
          label: ''
        }
      },
      maxItems: null,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title',
      create: false
    };
    vm.prequisiteOptions = [];
    CoursesService.query(function(prequisites) {
      vm.prequisiteOptions = _.map(prequisites, function(obj) {
        if (obj._id !== vm.course._id)
          return {
            id: obj._id,
            title: obj.name,
            value: obj._id
          };
      });
    });

    vm.competencies = _.pluck(vm.course.competencies,'_id');
    vm.competencyConfig = {
      plugins: {
        'remove_button': {
          label: ''
        }
      },
      maxItems: null,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title',
      create: false
    };
    vm.competencyOptions = [];
    CompetenciesService.query(function(competencies) {
      vm.competencyOptions = _.map(competencies, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
    });

    var $course_start = $('#uk_course_start'),
      $course_end = $('#uk_course_end'),
      $enroll_start = $('#uk_enroll_start'),
      $enroll_end = $('#uk_enroll_end');

    var start_date = UIkit.datepicker($course_start, {
      format: 'DD.MM.YYYY'
    });

    var end_date = UIkit.datepicker($course_end, {
      format: 'DD.MM.YYYY'
    });

    var enroll_start_date = UIkit.datepicker($enroll_start, {
      format: 'DD.MM.YYYY'
    });

    var enroll_end_date = UIkit.datepicker($enroll_end, {
      format: 'DD.MM.YYYY'
    });

    $course_start.on('change', function() {
      end_date.options.minDate = $course_start.val();
      vm.course.startDate = moment($course_start.val(), 'DD.MM.YYYY');
    });

    $course_end.on('change', function() {
      start_date.options.maxDate = $course_end.val();
      vm.course.endDate = moment($course_end.val(), 'DD.MM.YYYY');
    });

    $enroll_start.on('change', function() {
      enroll_end_date.options.minDate = $enroll_start.val();
      vm.course.enrollStartDate = moment($enroll_start.val(), 'DD.MM.YYYY');
    });

    $enroll_end.on('change', function() {
      enroll_start_date.options.maxDate = $enroll_end.val();
      vm.course.enrollEndDate = moment($enroll_end.val(), 'DD.MM.YYYY');
    });

    vm.groupConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };
    vm.groupOptions = [];
    GroupsService.listCourseGroup(function(data) {
      vm.groupOptions = _.map(data, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
    });

    if (!vm.course._id) {
      vm.course = _.extend(vm.course, {
        level: 'easy',
        status: 'draft',
        model: 'self-paced',
        enrollPolicy: 'open',
        enrollStatus: false,
        displayMode: 'open'
      });
    }

    function activate() {
      vm.course.status = 'available';
      vm.course.$update(
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Course activated successfully!'
          });
        },
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Course activated failed!'
          });
        });
    }

    function deactivate() {
      vm.course.status = 'unavailable';
      vm.course.$update(
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Course deactivated successfully!'
          });
        },
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Course deactivated failed!'
          });
        });
    }

    function save() {
      vm.course.competencies = vm.competencies;
      vm.course.prequisites = vm.prequisites;
      if (!vm.course.group) {
        UIkit.modal.alert($translate.instant('ERROR.COURSE.EMPTY_COURSE_GROUP'));
        return;
      }
      if (!vm.course._id)
        vm.course.$save(onSaveSuccess, onSaveFailure);
      else
        vm.course.$update(onSaveSuccess, onSaveFailure);
    }

    function onSaveSuccess(response) {
      if (!vm.logo) {
        Notification.success({
          message: '<i class="uk-icon-check"></i> Course saved successfully!'
        });
        $state.go('admin.workspace.cms.courses.view', {
          courseId: vm.course._id
        });
        return;
      }
      Upload.upload({
        url: '/api/courses/' + vm.course._id + '/logo',
        data: {
          newCourseLogo: vm.logo
        }
      }).then(function(response) {
        Notification.success({
          message: '<i class="uk-icon-check"></i> Course saved successfully!'
        });
        $state.go('admin.workspace.cms.courses.view', {
          courseId: vm.course._id
        });
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Logo update error!'
        });
      });
    }


    function onSaveFailure(errorResponse) {
      Notification.error({
        message: errorResponse.data.message,
        title: '<i class="uk-icon-ban"></i> Course saved error!'
      });
    }

    // Remove existing Course
    function remove() {
      UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        vm.course.$remove($state.go('admin.workspace.cms.courses.list'));
      });
    }

    function cancel() {
      if (vm.course._id)
        $state.go('admin.workspace.cms.courses.view', {
          courseId: vm.course._id
        });
      else
        $state.go('admin.workspace.cms.courses.list');
    }

  }
}(window.UIkit));
