(function() {
  'use strict';

  angular
    .module('shared')
    .directive('cardFullscreenDeactivate', [
      '$rootScope',
      '$window',
      'variables',
      function($rootScope, $window, variables) {
        return {
          restrict: 'E',
          replace: true,
          template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
          link: function(scope, el, attrs) {
            scope.cardFullscreenDeactivate = function($event) {
              $event.preventDefault();

              // get card placeholder width/height and offset
              var $thisPlaceholderCard = $('.md-card-placeholder'),
                mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                body_scroll_top = $('body').scrollTop(),
                mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                $thisCard = $('.md-card-fullscreen'),
                mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

              $thisCard
                // resize card to original size
                .velocity({
                  height: mdPlaceholderCard_h,
                  width: mdPlaceholderCard_w
                }, {
                  duration: 400,
                  easing: variables.easing_swiftOut,
                  begin: function(elements) {
                    // hide fullscreen content
                    $thisCard.find('.md-card-fullscreen-content').velocity('transition.slideDownOut', {
                      duration: 280,
                      easing: variables.easing_swiftOut
                    });
                    $rootScope.card_fullscreen = false;
                    if (mdCardToolbarFixed) {
                      $thisCard.removeClass('mdToolbar_fixed');
                    }
                  },
                  complete: function(elements) {
                    $rootScope.hide_content_sidebar = false;
                  }
                })
                // move card to original position
                .velocity({
                  left: mdPlaceholderCard_offset_left,
                  top: mdPlaceholderCard_offset_top
                }, {
                  duration: 400,
                  easing: variables.easing_swiftOut,
                  complete: function(elements) {
                    // remove some styles added by velocity.js
                    $thisCard.removeClass('md-card-fullscreen').css({
                      width: '',
                      height: '',
                      left: '',
                      top: ''
                    });
                    // remove card placeholder
                    $thisPlaceholderCard.remove();
                    $(window).resize();
                  }
                });
            };
          }
        };
      }
    ]);
}());
