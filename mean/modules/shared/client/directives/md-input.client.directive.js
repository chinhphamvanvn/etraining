(function () {
  'use strict';

  angular
  .module('shared')
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {

                            var extraClass = '';
                            if($elem.is('[class*="uk-form-width-"]')) {
                                var elClasses = $elem.attr('class').split (' ');
                                for(var i = 0; i < elClasses.length; i++){
                                    var classPart = elClasses[i].substr(0,14);
                                    if(classPart == "uk-form-width-"){
                                        var extraClass = elClasses[i];
                                    }
                                }
                            }

                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar '+extraClass+'"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                        return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                        return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ]);
}());