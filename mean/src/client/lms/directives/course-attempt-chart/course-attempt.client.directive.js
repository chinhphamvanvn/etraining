(function(c3) {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('courseAttemptChart', ['ReportsService', '$translate', '_', courseAttemptChart]);

  function courseAttemptChart(ReportsService, $translate, _) {
    return {
      scope: {
        day: '=',
        edition: '='
      },
      templateUrl: '/src/client/lms/directives/course-attempt-chart/course-attempt.client.view.html',
      link: function(scope, element, attributes) {

        var progress_chart_id = 'course_attempt_chart';
        var progress_chart = c3.generate({
          bindto: '#' + progress_chart_id,
          data: {
            x: 'x',
            columns: [
              ['x'],
              [$translate.instant('COMMON.MEMBER_ATTEMPT')]
            ],
            type: 'spline',
            labels: true
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                rotate: 60,
                multiline: false
              },
              height: 130
            },
            y: {
              tick: {
                format: d3.format('d')
              }
            }
          },
          color: {
            pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
          }
        });

        scope.$watch('day', function(newValue, oldValue) {
          if (newValue) {
            ReportsService.courseAttemptStats({
              day: newValue,
              editionId: scope.edition
            }, function(stats) {
              var date = ['x'];
              var attempt = [$translate.instant('COMMON.MEMBER_ATTEMPT')];
              _.each(stats, function(stat) {
                date.push(stat._id.day + '/' + stat._id.month + '/' + stat._id.year);
                attempt.push(stat.count);
              });
              progress_chart.load({
                columns: [
                  date,
                  attempt
                ]
              });
            });
          }
        });
      }
    };
  }
}(window.c3));
