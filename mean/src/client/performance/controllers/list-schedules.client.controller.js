(function(UIkit) {
  'use strict';

  angular
    .module('performance')
    .controller('ScheduleListController', ScheduleListController);

  ScheduleListController.$inject = ['$scope', '$state', 'uiCalendarConfig', '$compile', 'Authentication', 'SchedulesService', '$timeout', '$location', '$window', 'GroupsService', 'Notification', '$q', 'treeUtils', '$translate', '_'];

  function ScheduleListController($scope, $state, uiCalendarConfig, $compile, Authentication, SchedulesService, $timeout, $location, $window, GroupsService, Notification, $q, treeUtils, $translate, _) {
    var vm = this;
    vm.user = Authentication.user;

    vm.randID_generator = function() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      return randLetter + Date.now();
    };

    vm.color_picker = function(object, pallete) {
      if (object) {
        var cp_id = vm.randID_generator(),
          cp_pallete = pallete || ['#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#1e88e5', '#039be5', '#0097a7', '#00897b', '#43a047', '#689f38', '#ef6c00', '#f4511e', '#6d4c41', '#757575', '#546e7a'],
          cp_pallete_length = cp_pallete.length,
          cp_wrapper = $('<div class="cp_altair" id="' + cp_id + '"/>');

        for (var $i = 0; $i < cp_pallete_length; $i++) {
          cp_wrapper.append('<span data-color=' + cp_pallete[$i] + ' style="background:' + cp_pallete[$i] + '"></span>');
        }

        cp_wrapper.append('<input type="hidden">');

        $('body').on('click', '#' + cp_id + ' span', function() {
          $(this)
            .addClass('active_color')
            .siblings().removeClass('active_color')
            .end()
            .closest('.cp_altair').find('input').val($(this).attr('data-color'));
        });
        return object.append(cp_wrapper);

      }
    };

    vm.calendarColorPicker = vm.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');

    vm.uiConfig = {
      calendar: {
        header: {
          left: 'title today',
          center: '',
          right: 'month,agendaWeek,agendaDay,listWeek prev,next'
        },
        buttonIcons: {
          prev: 'md-left-single-arrow',
          next: 'md-right-single-arrow',
          prevYear: 'md-left-double-arrow',
          nextYear: 'md-right-double-arrow'
        },
        buttonText: {
          today: ' ',
          month: ' ',
          week: ' ',
          day: ' '
        },
        aspectRatio: 2.1,
        defaultDate: moment(),
        selectable: true,
        selectHelper: true,
        eventClick: function(date, jsEvent, view) {
          $state.go('admin.workspace.performance.schedules.view', {
            scheduleId: date._id
          });
        },
        select: function(start, end) {
          UIkit.modal.prompt('' +
          '<h3 class="heading_b uk-margin-medium-bottom">' + $translate.instant('PAGE.PERFORMANCE.SCHEDULE.NEW_TITLE') + '</h3><div class="uk-margin-medium-bottom" id="calendar_colors">' +
          $translate.instant('MODEL.SCHEDULE.COLOR') +
          vm.calendarColorPicker +
          '</div>' +
          $translate.instant('MODEL.SCHEDULE.NAME'),
            '', function(newvalue) {
              if ($.trim(newvalue) !== '') {
                var eventColor = $('#calendar_colors_wrapper').find('input').val();
                var schedule = new SchedulesService();
                schedule.name = newvalue;
                schedule.start = start;
                schedule.end = end;
                schedule.color = eventColor || '';
                schedule.$save(function() {
                  $state.go('admin.workspace.performance.schedules.edit', {
                    scheduleId: schedule._id
                  });
                }, function(errorResponse) {
                  Notification.error({
                    message: errorResponse.data.message,
                    title: '<i class="uk-icon-ban"></i> Exam created error!'
                  });
                });
              }
            }, {
              labels: {
                Ok: $translate.instant('ACTION.ADD')
              }
            });
        },
        editable: true,
        eventLimit: true,
        timeFormat: '(HH)(:mm)'
      }
    };
    vm.schedules = SchedulesService.query(function() {
      vm.calendar_events.slice(0, vm.calendar_events.length);
      _.each(vm.schedules, function(schedule) {
        var event = {
          title: schedule.name,
          color: schedule.color,
          _id: schedule._id
        };
        if (schedule.start)
          event.start = moment(schedule.start).format('YYYY-MM-DD');
        if (schedule.end)
          event.end = moment(schedule.end).format('YYYY-MM-DD');
        vm.calendar_events.push(event);
      });
    });

    vm.calendar_events = [];
    vm.eventSources = [vm.calendar_events];
  }

}(window.UIkit));
