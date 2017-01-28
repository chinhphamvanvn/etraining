(function () {
  'use strict';

  angular
  .module('shared')
    .directive('cardFullscreenWhole', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    $(el).on('click',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSActivate();
                        }
                    });

                    $(el).on('click','.cardFSDeactivate',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSDeactivate();
                        }
                    });

                    scope.cardFSActivate = function () {
                        var $thisCard = $(el),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    $thisCard.append('<span class="md-icon material-icons uk-position-top-right cardFSDeactivate" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            }, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    };
                    scope.cardFSDeactivate = function () {
                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                    $thisCard.find('.cardFSDeactivate').remove();
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
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
                            })

                    };
                }
            }
        }
    ]);
}());