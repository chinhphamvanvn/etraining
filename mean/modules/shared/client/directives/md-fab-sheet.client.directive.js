(function () {
  'use strict';

  angular
  .module('shared')
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ]);
}());