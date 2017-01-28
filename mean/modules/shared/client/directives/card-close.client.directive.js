(function () {
  'use strict';

  angular
  .module('shared')
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-close" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                                $(window).resize();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard);

                    }
                }
            }
        }
    ])
}());