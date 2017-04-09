(function() {
  'use strict';

  angular
    .module('shared')
    .directive('cardProgress', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          scope: true,
          link: function(scope, el, attrs) {

            var $this = $(el).children('.md-card-toolbar'),
              bg_percent = parseInt(attrs.cardProgress, 10);

            function updateCard(percent) {
              var bg_color_default = $this.attr('card-bg-default');

              var bg_color = !bg_color_default ? $this.css('backgroundColor') : bg_color_default;
              if (!bg_color_default) {
                $this.attr('card-bg-default', bg_color);
              }

              $this
                .css({
                  'background': '-moz-linear-gradient(left, ' + bg_color + ' ' + percent + '%, #fff ' + (percent) + '%)'
                })
                .css({
                  'background': '-webkit-linear-gradient(left, ' + bg_color + ' ' + percent + '%, #fff ' + (percent) + '%)'
                })
                .css({
                  'background': 'linear-gradient(to right,  ' + bg_color + ' ' + percent + '%, #fff ' + (percent) + '%)'
                });


              scope.cardPercentage = percent;
            }

            updateCard(bg_percent);

            scope.$watch(function() {
              return $(el).attr('card-progress');
            }, function(newValue) {
              updateCard(newValue);
            });

          }
        };
      }
    ]);
}());
