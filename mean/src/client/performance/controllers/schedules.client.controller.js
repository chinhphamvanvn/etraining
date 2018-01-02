(function(UIkit) {
  'use strict';

  // Schedules controller
  angular
    .module('performance')
    .controller('SchedulesController', SchedulesController);

  SchedulesController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'scheduleResolve', 'SchedulesService', 'Notification', 'GroupsService', 'CompetenciesService', '$translate', '_'];

  function SchedulesController($scope, $state, $window, Authentication, $timeout, schedule, SchedulesService, Notification, GroupsService, CompetenciesService, $translate, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.schedule = schedule;

    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.activate = activate;
    vm.deactivate = deactivate;
    var $scheduleValidate = $('#scheduleForm');

    $scheduleValidate
      .parsley()
      .on('form:validated', function() {
        $scope.$apply();
      })
      .on('field:validated', function(parsleyField) {
        if ($(parsleyField.$element).hasClass('md-input')) {
          $scope.$apply();
        }
      });


    var $schedule_start = $('#uk_schedule_start'),
      $schedule_end = $('#uk_schedule_end');

    var start_date = UIkit.datepicker($schedule_start, {
      format: 'DD.MM.YYYY'
    });

    var end_date = UIkit.datepicker($schedule_end, {
      format: 'DD.MM.YYYY'
    });


    $schedule_start.on('change', function() {
      end_date.options.minDate = $schedule_start.val();
      vm.schedule.start = moment($schedule_start.val(), 'DD.MM.YYYY');
    });

    $schedule_end.on('change', function() {
      start_date.options.maxDate = $schedule_end.val();
      vm.schedule.end = moment($schedule_end.val(), 'DD.MM.YYYY');
    });


    function activate() {
      vm.schedule.status = 'available';
      vm.schedule.$update(
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Schedule activated successfully!'
          });
        },
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Schedule activated failed!'
          });
        });
    }

    function deactivate() {
      vm.schedule.status = 'unavailable';
      vm.schedule.$update(
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Schedule deactivated successfully!'
          });
        },
        function() {
          Notification.success({
            message: '<i class="uk-icon-check"></i> Schedule deactivated failed!'
          });
        });
    }

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

    vm.competencies = _.pluck(vm.schedule.competencies, '_id');
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


    function save() {
      vm.schedule.competencies = vm.competencies;
      vm.schedule.$update(function() {
        Notification.success({
          message: '<i class="uk-icon-check"></i> Schedule saved successfully!'
        });
        $state.go('admin.workspace.performance.schedules.view', {
          scheduleId: vm.schedule._id
        });

      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Schedule saved error!'
        });
      });
    }

    // Remove existing Schedule
    function remove() {
      UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
        vm.schedule.$remove($state.go('admin.workspace.performance.schedules.list'));
      });
    }

    function cancel() {
      if (vm.schedule._id)
        $state.go('admin.workspace.performance.schedules.view', {
          scheduleId: vm.schedule._id
        });
      else
        $state.go('admin.workspace.performance.schedules.list');
    }

  }
}(window.UIkit));
