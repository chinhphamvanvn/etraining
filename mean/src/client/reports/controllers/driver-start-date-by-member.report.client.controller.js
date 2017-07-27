(function(c3) {
  'use strict';

  angular
    .module('reports')
    .controller('DriverStartDateController', DriverStartDateController);

  DriverStartDateController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'GroupsService', 'AdminService', 'SchedulesService', 'ExamCandidatesService', 'SubmissionsService', '$timeout', '$window', '$translate', 'examUtils', 'treeUtils', '_'];

  function DriverStartDateController($scope, $rootScope, $state, Authentication, GroupsService, AdminService, SchedulesService, ExamCandidatesService, SubmissionsService, $timeout, $window, $translate, examUtils, treeUtils, _) {
    var vm = this;
    $scope.Math = $window.Math;
    vm.authentication = Authentication;
    vm.generateReport = generateReport;

    vm.scheduleConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };

    function generateReport(users) {
      var listUserForStartDate = [];
      var listUserForDriver = [];
      var totalUser = users.length;
      _.each(users, function(user) {
        if(user.startDate) {
          listUserForStartDate.push(user);
        }
        if(user.driverLicense) {
          listUserForDriver.push(user);
        }
      });
      drawDepartmentMarkChart(totalUser, listUserForStartDate, listUserForDriver);
    }

    function differenceTwoDate (date1, date2) {
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      return diffDays;
    }
    
    function drawDepartmentMarkChart(totalUser, listUserForStartDate, listUserForDriver, candidates,departments, benchmark) {
        var markRangesStartDate = ["1 - 3 Year", "3 - 5 Year", ">= 5 Year"];
        var markRangesDriver = ["yes", "no"];
        var marksStartDate = [0,0,0];
        var marksDriver = [0,0];

        listUserForStartDate.forEach(function(user) {
          var diffDays = differenceTwoDate(new Date(user.startDate), new Date());
          if(diffDays < 365 *3) {
            marksStartDate[0] ++;
          } else if (365 *3 <= diffDays < 365 * 5) {
            marksStartDate[1] ++;
          } else {
            marksStartDate[2] ++;
          }
        });

        listUserForDriver.forEach(function(user) {
          if(user.driverLicense === "yes") {
            marksDriver[0] ++;
          } else {
            marksDriver[1] ++;
          }
        });

        var pie_chart_1 = c3.generate({
            bindto: '#department_mark_pie_chart_1',
            legend: {
                position: 'right'
            },
            color: {
                pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
              },
              
            data: {
                columns: [
                    [markRangesStartDate[0], marksStartDate[0]],
                    [markRangesStartDate[1], marksStartDate[1]],
                    [markRangesStartDate[2], marksStartDate[2]],
                ],
                type : 'pie',
            },
            y: {
                lines: [
                    {value: 50, text: 'Benchmark'},
                ]
            }
        });
        var pie_chart_1 = c3.generate({
            bindto: '#department_mark_pie_chart_2',
            legend: {
                position: 'right'
            },
            color: {
                pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
              },
              
            data: {
                columns: [
                    [markRangesDriver[0], marksDriver[0]],
                    [markRangesDriver[1], marksDriver[1]],
                ],
                type : 'pie',
            },
            y: {
                lines: [
                    {value: 50, text: 'Benchmark'},
                ]
            }
        });

    }

  }
}(window.c3));
