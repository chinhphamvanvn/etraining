(function () {
    'use strict';

    angular
      .module('performance')
      .controller('CompetencyController', CompetencyController);

    CompetencyController.$inject = [ '$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'competencyResolve','Upload', 'Notification','QuestionsService', 'treeUtils','$q', '_'];

    function CompetencyController( $scope, $state, $stateParams, $timeout, $location, $window, competency, Upload, Notification, QuestionsService, treeUtils,$q, _) {
      var vm = this;
      vm.competency = competency;
      if (!vm.competency._id)
          vm.competency.levels = [];
      vm.save = save;
     

      function save() {
          vm.competency.$update().then(function() {
              $state.go('admin.workspace.performance.competency.list');
          });
      }
      
    
    
    }
  }());

