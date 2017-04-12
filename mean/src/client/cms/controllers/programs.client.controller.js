(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('cms')
    .controller('ProgramsController', ProgramsController);

  ProgramsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'programResolve', 'CoursesService', 'Notification', 'CompetenciesService', 'fileManagerConfig', '$translate', '_'];

  function ProgramsController($scope, $state, $window, Authentication, $timeout, program, CoursesService, Notification, CompetenciesService, fileManagerConfig, $translate, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.program = program;
    vm.error = null;
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.activate = activate;
    vm.deactivate = deactivate;
    vm.tinymce_options = fileManagerConfig;
    var $programValidate = $('#programForm');

    $programValidate
      .parsley()
      .on('form:validated', function() {
        $scope.$apply();
      })
      .on('field:validated', function(parsleyField) {
        if ($(parsleyField.$element).hasClass('md-input')) {
          $scope.$apply();
        }
      });

    vm.courses = _.pluck(vm.program.courses, '_id');
    vm.courseConfig = {
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
    vm.courseOptions = [];
    CoursesService.query(function(courses) {
      vm.courseOptions = _.map(courses, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
    });

    vm.competencies = _.pluck(vm.program.competencies, '_id');
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


    function activate() {
      vm.program.status = 'available';
      vm.program.$update(
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Program activated successfully!'
          });
        },
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Program activated failed!'
          });
        });
    }

    function deactivate() {
      vm.program.status = 'unavailable';
      vm.program.$update(
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Program deactivated successfully!'
          });
        },
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Program deactivated failed!'
          });
        });
    }


    function save() {
      vm.program.competencies = vm.competencies;
      vm.program.courses = vm.courses;
      if (!vm.program._id)
        vm.program.$save(onSaveSuccess, onSaveFailure);
      else
        vm.program.$update(onSaveSuccess, onSaveFailure);
    }


    function onSaveSuccess(response) {
      Notification.success({
        message: '<i class="uk-icon-check"></i> Program saved successfully!'
      });
      $state.go('admin.workspace.cms.programs.view', {
        programId: vm.program._id
      });
    }


    function onSaveFailure(errorResponse) {
      Notification.error({
        message: errorResponse.data.message,
        title: '<i class="uk-icon-ban"></i> Program saved error!'
      });
    }

    // Remove existing Course
    function remove() {
      UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        vm.program.$remove($state.go('admin.workspace.cms.programs.list'));
      });
    }

    function cancel() {
      if (vm.program._id)
        $state.go('admin.workspace.cms.programs.view', {
          programId: vm.program._id
        });
      else
        $state.go('admin.workspace.cms.programs.list');
    }

  }
}(window.UIkit));
