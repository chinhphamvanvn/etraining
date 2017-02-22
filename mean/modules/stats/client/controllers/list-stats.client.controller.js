(function () {
  'use strict';

  angular
    .module('stats')
    .controller('StatsListController', StatsListController);

  StatsListController.$inject = ['StatsService'];

  function StatsListController(StatsService) {
    var vm = this;

    vm.stats = StatsService.query();
  }
}());
