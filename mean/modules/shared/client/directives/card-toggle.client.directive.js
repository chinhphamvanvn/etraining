(function () {
  'use strict';

  angular
  .module('shared')
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {

                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                                $(window).resize();
                            }
                        });
                    };

                    // hide card content on page load
                    var thisCard = $(el).closest('.md-card');
                    if(thisCard.hasClass('md-card-collapsed')) {
                        var $this_toggle = thisCard.find('.md-card-toggle');

                        $this_toggle.html('&#xE313;');
                        thisCard.children('.md-card-content').hide();
                    }

                }
            }
        }
    ]);
}());