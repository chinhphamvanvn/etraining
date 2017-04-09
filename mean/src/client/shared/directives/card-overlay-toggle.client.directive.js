(function() {
  'use strict';

  angular
    .module('shared')
    .directive('cardOverlayToggle', [
      function() {
        return {
          restrict: 'E',
          template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
          replace: true,
          scope: true,
          link: function(scope, el, attrs) {

            if (el.closest('.md-card').hasClass('md-card-overlay-active')) {
              el.html('&#xE5CD;');
            }

            scope.toggleOverlay = function($event) {

              $event.preventDefault();

              if (!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                el
                  .html('&#xE5CD;')
                  .closest('.md-card').addClass('md-card-overlay-active');

              } else {
                el
                  .html('&#xE5D4;')
                  .closest('.md-card').removeClass('md-card-overlay-active');
              }

            };
          }
        };
      }
    ]);
}());
