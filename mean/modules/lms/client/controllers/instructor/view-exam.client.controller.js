(function() {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('ExamViewController', ExamViewController);

  ExamViewController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'examResolve', 'scheduleResolve', 'QuestionsService', 'Notification', 'GroupsService', 'Upload', '$q', '_'];

  function ExamViewController($scope, $state, $window, Authentication, $timeout, exam, schedule, QuestionsService, Notification, GroupsService, Upload, $q, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.schedule = schedule;
    vm.exam = exam;
    console.log('=======', exam);
    // if (vm.exam.questionCategory)
    //     vm.category = GroupsService.get({groupId:vm.exam.questionCategory});
    if (vm.exam.questionSelection === 'manual') {
      vm.selectedQuestions = [];
      var selectedIds = _.pluck(vm.exam.questions, 'id');
      if (selectedIds.length)
        vm.selectedQuestions = QuestionsService.byIds({
          questionIds: _.pluck(vm.exam.questions, 'id')
        }, function() {
          _.each(vm.selectedQuestions, function(question) {
            var examQuestion = _.find(vm.exam.questions, function(q) {
              return q.id === question._id;
            });
            question.score = examQuestion.score;
            question.order = examQuestion.order;
          });
        });
    }

  }
}());
