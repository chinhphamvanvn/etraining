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
      QuestionsService.saveRecursive(vm.question).then(function() {
        $state.go('admin.workspace.performance.question.view', {
          questionId: vm.question._id
        });
      });

    }

  }
}());
