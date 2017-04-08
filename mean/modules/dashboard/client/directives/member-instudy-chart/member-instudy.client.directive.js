(function(c3) {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('dashboard')
    .directive('memberInstudyChart', ['ReportsService', '$translate', '_', memberInstudyChart]);

  function memberInstudyChart(ReportsService, $translate, _) {
    return {
      scope: {
        day: '='
      },
      templateUrl: '/modules/dashboard/client/directives/member-instudy-chart/member-instudy.directive.client.view.html',
      link: function(scope, element, attributes) {

        var progress_chart_id = 'member_instudy_chart';
        var progress_chart = c3.generate({
          bindto: '#' + progress_chart_id,
          data: {
            x: 'x',
            columns: [
              ['x'],
              [$translate.instant('COMMON.ENROLL.INSTUDY')]
            ],
            type: 'bar',
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
            }
          },
          color: {
            pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
          }
        });

        scope.$watch('day', function(newValue, oldValue) {
          if (newValue) {
            ReportsService.memberInstudyStats({
              day: newValue
            }, function(stats) {
              var date = ['x'];
              var instudy = [$translate.instant('COMMON.ENROLL.INSTUDY')];
              _.each(stats, function(stat) {
                date.push(moment(stat.created).format('DD/MM/YYYY'));
                instudy.push(stat.count);
              });
              progress_chart.load({
                columns: [
                  date,
                  instudy
                ]
              });
            });
          }
        });
      }
    };
  }
}(window.c3));
