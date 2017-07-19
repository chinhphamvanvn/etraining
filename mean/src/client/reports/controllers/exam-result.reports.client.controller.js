(function(c3) {
  'use strict';

  angular
    .module('reports')
    .controller('ExamResultReportsController', ExamResultReportsController);

  ExamResultReportsController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'GroupsService', 'AdminService', 'SchedulesService', 'ExamCandidatesService', 'SubmissionsService', '$timeout', '$window', '$translate', 'examUtils', 'treeUtils', '_'];

  function ExamResultReportsController($scope, $rootScope, $state, Authentication, GroupsService, AdminService, SchedulesService, ExamCandidatesService, SubmissionsService, $timeout, $window, $translate, examUtils, treeUtils, _) {
    var vm = this;
    $scope.Math = $window.Math;
    vm.authentication = Authentication;
    vm.generateReport = generateReport;
    // vm.getExportData = getExportData;
    // vm.getExportHeader = getExportHeader;
    vm.selectSchedule = generateReport;

    vm.scheduleConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };
    vm.scheduleOptions = [];
    vm.schedules = SchedulesService.query(function() {
      vm.scheduleOptions = _.map(vm.schedules, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
    });

    function generateReport() {
      if (!vm.scheduleId)
        return;
      var schedule = _.find(vm.schedules, function(obj) {
        return obj._id === vm.scheduleId;
      });
      vm.summary = {
        passRate: 0,
        score: 0,
        submit: 0
      };
      vm.candidates = [];
      ExamCandidatesService.byExam({
        examId: schedule.exam
      }, function(candidates) {
        candidates = _.filter(candidates, function(candidate) {
          return candidate.role === 'student';
        });
        _.each(candidates, function(candidate) {
          examUtils.candidateProgress(candidate, candidate.exam).then(function(progress) {
            candidate.submit = progress.count;
            candidate.firstSubmit = progress.firstSubmit.start;
            vm.summary.submit += candidate.submit;
          });
          examUtils.candidateScore(candidate, candidate.exam).then(function(score) {
            candidate.score = score;
            vm.summary.score += score;
            if (candidate.score < candidate.exam.benchmark)
              candidate.result = false;
            else {
              candidate.result = true;
              vm.summary.passRate++;
            }
          });
          vm.candidates.push(candidate);
        });
        drawChart(candidates) ;
      });
    }
    
    function drawChart(candidates) {
        var chart = c3.generate({
            data: {
                // iris data from R
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type : 'pie',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            }
        });

        setTimeout(function () {
            chart.load({
                columns: [
                    ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                    ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                    ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                ]
            });
        }, 1500);

        setTimeout(function () {
            chart.unload({
                ids: 'data1'
            });
            chart.unload({
                ids: 'data2'
            });
        }, 2500);
    }
    // function getExportData() {
    //   var data = [];
    //   _.each(vm.candidates, function(candidate) {
    //     data.push({
    //       exam: candidate.schedule.name,
    //       fullname: candidate.candidate.displayName,
    //       username: candidate.candidate.username,
    //       position: candidate.candidate.position,
    //       firstSubmit: candidate.firstSubmit ? moment(new Date(candidate.firstSubmit)).format('DD/MM/YYYY') : '',
    //       score: candidate.score,
    //       submit: candidate.submit,
    //       result: candidate.result ? $translate.instant('COMMON.PASS') : $translate.instant('COMMON.FAIL')
    //     });
    //   });
    //   return data;
    // }
    //
    // function getExportHeader() {
    //   return [
    //     $translate.instant('MODEL.SCHEDULE.NAME'),
    //     $translate.instant('MODEL.USER.DISPLAY_NAME'),
    //     $translate.instant('MODEL.USER.USERNAME'),
    //     $translate.instant('MODEL.USER.POSITION'),
    //     $translate.instant('REPORT.EXAM_RESULT.FIRST_SUBMIT'),
    //     $translate.instant('REPORT.EXAM_RESULT.SCORE'),
    //     $translate.instant('REPORT.EXAM_RESULT.SUBMIT'),
    //     $translate.instant('REPORT.EXAM_RESULT.RESULT')
    //   ];
    // }

  }
}(window.c3));
