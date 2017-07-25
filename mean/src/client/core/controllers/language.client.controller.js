(function() {
  'use strict';

  angular
    .module('core')
    .controller('LanguageController', LanguageController);

  LanguageController.$inject = ['$scope', '$state', '$translate','$rootScope'];

  function LanguageController($scope, $state, $translate, $rootScope) {
    var vm = this;
    vm.langSwitcherModel = 'vn';
    var langData = vm.langSwitcherOptions = [
      {
        id: 1,
        title: 'English',
        value: 'gb'
      },
      {
        id: 2,
        title: 'Tiếng Việt',
        value: 'vn'
      }
    ];
    vm.langSwitcherConfig = {
      maxItems: 1,
      render: {
        option: function(langData, escape) {
          return '<div class="option">' +
            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
            '<span>' + escape(langData.title) + '</span>' +
            '</div>';
        },
        item: function(langData, escape) {
          return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
        }
      },
      valueField: 'value',
      labelField: 'title',
      searchField: 'title',
      create: false,
      onInitialize: function(selectize) {
        $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
      },
      onChange: function(args) {
        vm.langSwitcherModel = args;
        $translate.use(args);
        $rootScope.language = args;
      }
    };
  }
}());
