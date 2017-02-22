(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('dashboard')
    .directive('userLoginChart', ['ReportsService','$translate',  '_', userLoginChart]);

  function userLoginChart(ReportsService, $translate, _) {
      
      return {
          scope: {
              stats: "=",
          },
          templateUrl:'/modules/dashboard/client/directives/user-login-chart/user-login.directive.client.view.html',
          link: function (scope, element, attributes) {
              
              var progress_chart_id = 'login_chart';
              var progress_chart = c3.generate({
                  bindto: '#'+progress_chart_id,
                  data: {
                      x : 'x',
                      columns: [
                           ['x'],
                          [$translate.instant('PAGE.DASHBOARD.USER_STATS.LOGIN_COUNT')],
                      ],
                      type: 'spline',
                      labels: true
                  },
                  axis: {
                      x: {
                          type: 'category' // this needed to load string x value
                      }
                  },
                  color: {
                      pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
                  }
              });
              
              ReportsService.userLoginStats(function(stats) {
                  var date = ['x'];
                  var login =[$translate.instant('PAGE.DASHBOARD.USER_STATS.LOGIN_COUNT')];
                  _.each(stats,function(stat) {
                      date.push(stat.created);
                      login.push(stat.count);
                  });
                  progress_chart.load({
                      columns: [
                            date,
                            login,
                      ]
                  });
              })
          }
      }
  }
}());
