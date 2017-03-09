(function () {
  'use strict';

  angular
  .module('shared')
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ]);
}());