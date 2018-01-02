(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStatsController', CoursesStatsController);

  CoursesStatsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'OptionsService', 'QuestionsService', 'Notification', 'AttemptsService', 'CourseMembersService', 'EditionSectionsService', '$translate', '_'];

  function CoursesStatsController($scope, $state, $window, Authentication, $timeout, edition, course, OptionsService, QuestionsService, Notification, AttemptsService, CourseMembersService, EditionSectionsService, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;

    vm.memberStatsDayOptions = _.map([7, 15, 30], function(obj) {
      return {
        title: obj + ' ' + $translate.instant('COMMON.DAY'),
        value: obj
      };
    });

    vm.memberStatsDay = vm.memberStatsDayOptions[0].value;

    vm.memberStatsDayConfig = {
      create: false,
      maxItems: 1,
      placeholder: $translate.instant('PAGE.LMS.MY_COURSES.TEACHER_BOARD.REPORT.COMPREHENSIVE.ATTEMPT_CHART.SELECT_DAY'),
      valueField: 'value',
      labelField: 'title'
    };


  }
}());
