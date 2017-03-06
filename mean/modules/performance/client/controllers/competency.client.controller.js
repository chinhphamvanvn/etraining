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
      vm.addLevel = addLevel;
      vm.removeLevel = removeLevel;
      vm.upLevel = upLevel;
      vm.downLevel = downLevel;

      function save() {
          var allPromise = [];
          allPromise.push(vm.competency.$update().$promise);
          _.each(vm.competency.options,function(option) {
              allPromise.push(option.$update().$promise);
          });
          $q.all(allPromise).then(function() {
              $state.go('admin.workspace.performance.competency.list');
          });
      }
      
      function addLevel() {
          var newLevel = {name:'',order:vm.competency.levels.length+1};
          vm.competency.levels.push(newLevel);
      }
      
      function removeLevel(level) {
          vm.competency.levels = _.reject(vm.competency.levels ,function(l) {
              return l.order == level;
          })
      }
      
      function upLevel(level) {
          var nextLevel = _.find(vm.competency.levels ,function(l) {
              return l.order > level.order;
          });
          if (nextLevel) {
              var order = level.order;
              level.order = nextLevel.order;
              nextLevel.order = order;
          }
      }
      
      function downLevel(level) {
          var prevLevel = _.find(vm.competency.levels ,function(l) {
              return l.order < level.order;
          });
          if (prevLevel) {
              var order = level.order;
              level.order = prevLevel.order;
              prevLevel.order = order;
          }
      }
    
    }
  }());

