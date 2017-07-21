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
        var promiseCount = 0;
        _.each(candidates, function(candidate) {
          examUtils.candidateProgress(candidate, candidate.exam).then(function(progress) {
            candidate.submit = progress.count;
            candidate.firstSubmit = progress.firstSubmit.start;
            vm.summary.submit += candidate.submit;
          });
          examUtils.candidateScore(candidate, candidate.exam).then(function(score) {
            promiseCount +=1;
            candidate.score = score;
            vm.summary.score += score;
            if (candidate.score < candidate.exam.benchmark)
              candidate.result = false;
            else {
              candidate.result = true;
              vm.summary.passRate++;
            }
            if (promiseCount == candidates.length) {
                GroupsService.byCategory({
                    category: 'organization'
                  }, function(departments) {
                      drawDepartmentMarkChart(candidates,departments, candidate.exam.benchmark) ;
                      drawDepartmentPassChart(candidates,departments) ;
                  });
            }
          });
          vm.candidates.push(candidate);
        });
        
      });
    }
    
    function drawDepartmentMarkChart(candidates,departments, benchmark) {
        var markRanges = [];
        var marksGroupByRange = [0,0,0,0,0]
        var marksGroupByRangeAndDepartment = [];
        for (var i=0;i<5;i++) {
            markRanges.push(i*20 +' - '+(i+1)*20+'%');
        }
        var departmentNames = [];
        _.each(departments, function(d) {
            departmentNames.push(d.name);
         });
       
        
        for(var i = 0;i<5;i++) {
            var temp = [];
            _.each(departments, function(d, index) {
               temp.push(0); 
            });
            marksGroupByRangeAndDepartment.push(temp);
        }
        _.each(candidates,function(c) {
            var groupId = Math.floor(c.score / 20);
            if (groupId >=4)
                groupId = 4;
            marksGroupByRange[groupId]++;
            _.each(departments, function(d, index) {
                if (d._id === c.candidate.group) {
                    marksGroupByRangeAndDepartment[groupId][index]++;
                }
             });
            
         });
        
        
        
        var pie_chart = c3.generate({
            bindto: '#department_mark_pie_chart',
            legend: {
                position: 'right'
            },
            color: {
                pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
              },
              
            data: {
                columns: [
                    [markRanges[0], marksGroupByRange[0]],
                    [markRanges[1], marksGroupByRange[1]],
                    [markRanges[2], marksGroupByRange[2]],
                    [markRanges[3], marksGroupByRange[3]],
                    [markRanges[4], marksGroupByRange[4]]
                ],
                type : 'pie',
            },
            y: {
                lines: [
                    {value: 50, text: 'Benchmark'},
                ]
            }
        });


        var stack_chart = c3.generate({
            bindto: '#department_mark_stack_chart',
            data: {
                columns: [
                    [markRanges[0]].concat( marksGroupByRangeAndDepartment[0]),
                    [markRanges[1]].concat( marksGroupByRangeAndDepartment[1]),
                    [markRanges[2]].concat( marksGroupByRangeAndDepartment[2]),
                    [markRanges[3]].concat( marksGroupByRangeAndDepartment[3]),
                    [markRanges[4]].concat( marksGroupByRangeAndDepartment[4])
                  ],

                
              
            },
            axis: {
                x: {
                    type: 'category',
                    categories: departmentNames
                }
              },
            type: 'bar',
            color: {
                pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
              },
              grid: {
                  x: {
                      show: true
                  },
                  y: {
                      show: true
                  }
              },
            groups: [
                markRanges
            ]
        });




    }
    
function drawDepartmentPassChart(candidates,departments) {
        
    var results = ['Pass', 'Fail'];
    var marksGroupByResults = [0,0,0,0,0]
    var marksGroupByResultAndDepartment = [];

    var departmentNames = [];
    _.each(departments, function(d) {
        departmentNames.push(d.name);
     });
   
    
    for(var i = 0;i<2;i++) {
        var temp = [];
        _.each(departments, function(d, index) {
           temp.push(0); 
        });
        marksGroupByResultAndDepartment.push(temp);
    }
    _.each(candidates,function(c) {
        var groupId = 1;
        if (c.result)
            groupId = 0;
        marksGroupByResults[groupId]++;
        _.each(departments, function(d, index) {
            if (d._id === c.candidate.group) {
                marksGroupByResultAndDepartment[groupId][index]++;
            }
         });
        
     });
    
    
    
    var pie_chart = c3.generate({
        bindto: '#department_pass_pie_chart',
        legend: {
            position: 'right'
        },
        color: {
            pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
          },
          
        data: {
            columns: [
                [results[0], marksGroupByResults[0]],
                [results[1], marksGroupByResults[1]],
            ],
            type : 'pie',
        }
    });


    var stack_chart = c3.generate({
        bindto: '#department_pass_stack_chart',
        data: {
            columns: [
                [results[0]].concat( marksGroupByResultAndDepartment[0]),
                [results[1]].concat( marksGroupByResultAndDepartment[1]),

              ],

            
          
        },
        axis: {
            x: {
                type: 'category',
                categories: departmentNames
            }
          },
        type: 'bar',
        color: {
            pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
          },
          grid: {
              x: {
                  show: true
              },
              y: {
                  show: true
              }
          },
        groups: [
            results
        ]
    });


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
