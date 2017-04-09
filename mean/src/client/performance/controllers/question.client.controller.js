(function() {
  'use strict';

  angular
    .module('performance')
    .controller('QuestionController', QuestionController);

  QuestionController.$inject = ['$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'questionResolve', 'Upload', 'Notification', 'QuestionsService', 'treeUtils', '$q', '_'];

  function QuestionController($scope, $state, $stateParams, $timeout, $location, $window, question, Upload, Notification, QuestionsService, treeUtils, $q, _) {
    var vm = this;
    vm.question = question;
    vm.save = save;


    function save() {
      var allPromise = [];
      allPromise.push(vm.question.$update().$promise);
      _.each(vm.question.options, function(option) {
        allPromise.push(option.$update().$promise);
      });
      $q.all(allPromise).then(function() {
        $state.go('admin.workspace.performance.question.view', {
          questionId: vm.question._id
        });
      });
    }

  }
}());
