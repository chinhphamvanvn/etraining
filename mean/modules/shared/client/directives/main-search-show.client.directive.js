(function () {
  'use strict';

  angular
  .module('shared')
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        'variables',
        '$timeout',
        function ($rootScope, $window, variables, $timeout) {
            return {
                restrict: 'E',
                template: '<a id="main_search_btn" class="user_action_icon" ng-click="showSearch()"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function() {

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ]);
}());