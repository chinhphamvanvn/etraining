(function () {
  'use strict';

  // Stats controller
  angular
    .module('stats')
    .controller('StatsController', StatsController);

  StatsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'statResolve'];

  function StatsController ($scope, $state, $window, Authentication, stat) {
    var vm = this;

    vm.authentication = Authentication;
    vm.stat = stat;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Stat
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.stat.$remove($state.go('stats.list'));
      }
    }

    // Save Stat
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.statForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.stat._id) {
        vm.stat.$update(successCallback, errorCallback);
      } else {
        vm.stat.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('stats.view', {
          statId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
