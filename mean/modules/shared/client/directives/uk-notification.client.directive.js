(function () {
  'use strict';

  angular
  .module('shared')
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
}());