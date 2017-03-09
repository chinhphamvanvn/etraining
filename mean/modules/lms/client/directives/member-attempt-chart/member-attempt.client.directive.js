(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('memberAttemptChart', ['ReportsService','$translate',  '_', memberAttemptChart]);

  function memberAttemptChart(ReportsService, $translate, _) {
      
      return {
          scope: {
              member: "=",
              edition:"="
          },
          templateUrl:'/modules/lms/client/directives/member-attempt-chart/member-attempt.directive.client.view.html',
          link: function (scope, element, attributes) {
              
              var progress_chart_id = 'member_attempt_chart';
              var progress_chart = c3.generate({
                  bindto: '#'+progress_chart_id,
                  data: {
                      x : 'x',
                      columns: [
                           ['x'],
                          [$translate.instant('COMMON.MEMBER_ATTEMPT')],
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
                      }
                  },
                  color: {
                      pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
                  }
              });
              
              scope.$watch('member', function(newValue, oldValue) {
                  if (newValue) {
                      ReportsService.memberAttemptStats({memberId:scope.member._id,editionId:scope.edition},function(stats) {
                          var date = ['x'];
                          var attempt =[$translate.instant('COMMON.MEMBER_ATTEMPT')];
                          _.each(stats,function(stat) {
                              date.push(stat._id.day+'/'+stat._id.month+'/'+stat._id.year);
                              attempt.push(stat.count);
                          });
                          progress_chart.load({
                              columns: [
                                    date,
                                    attempt,
                              ]
                          });
                      })
                  }
                });
              
              
             
          }
      }
  }
}());
