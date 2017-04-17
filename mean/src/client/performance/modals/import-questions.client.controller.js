(function(UIkit) {
  'use strict';

  angular
    .module('performance')
    .controller('QuestionImportController', QuestionImportController);

  QuestionImportController.$inject = ['$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', '$timeout', '$location', '$window', 'GroupsService', 'QuestionsService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Notification', 'treeUtils', '$translate', '_'];

  function QuestionImportController($scope, $state, $filter, $compile, Authentication, AdminService, $timeout, $location, $window, GroupsService, QuestionsService, DTOptionsBuilder, DTColumnDefBuilder, Notification, treeUtils, $translate, _) {
    var vm = this;
    vm.user = Authentication.user;
    vm.questions = [];
    vm.headers = [];
    vm.importData = importData;
    vm.selectedGroup = selectedGroup;
    $scope.readExcel = readExcel;
    vm.csv = {
      content: null,
      header: true,
      headerVisible: true,
      separator: ',',
      result: null,
      encoding: 'ISO-8859-1',
      acceptSize: 4 * 1024,
      uploadButtonLabel: 'Select CSV file'
    };
    vm.finishLoad = finishLoad;

    vm.columnOptions = [
      {
        id: 1,
        title: $translate.instant('MODEL.QUESTION.TITLE'),
        value: 'title',
        parent_id: 1
      },
      {
        id: 2,
        title: $translate.instant('MODEL.QUESTION.DESC'),
        value: 'description',
        parent_id: 1
      },
      {
        id: 3,
        title: $translate.instant('MODEL.QUESTION.LEVEL'),
        value: 'level',
        parent_id: 1
      },
      {
        id: 4,
        title: $translate.instant('MODEL.QUESTION.TYPE'),
        value: 'type',
        parent_id: 1
      },
      {
        id: 5,
        title: $translate.instant('MODEL.QUESTION.CORRECT_OPTIONS'),
        value: 'correctOptions',
        parent_id: 1
      },
      {
        id: 6,
        title: $translate.instant('MODEL.QUESTION.WRONG_OPTIONS'),
        value: 'wrongOptions',
        parent_id: 1
      }
    ];

    vm.columnConfigs = {
      create: false,
      maxItems: 1,
      placeholder: 'Column',
      valueField: 'value',
      labelField: 'title'
    };

    var closeButton = $('#dialogClose');

    function readExcel(result) {
      var i;
      if (!result.headers || result.headers.length === 0) {
        vm.headers = [];
        for (i = 0; i < result.columnCount; i++)
          vm.headers.push({
            name: i
          });
      } else {
        vm.headers = [];
        result.headers.forEach(function(header){
          vm.headers.push({
            name: header
          });
        })
      }
      vm.questions = result.rows;
      $scope.$apply();
    }

    function finishLoad() {
      var i;
      if (!vm.csv.result.headers || vm.csv.result.headers.length === 0) {
        vm.headers = [];
        for (i = 0; i < vm.csv.result.columnCount; i++)
          vm.headers.push({
            name: i
          });
      } else {
        vm.headers = [];
        for (i = 0; i < vm.csv.result.columnCount; i++)
          vm.headers.push({
            name: vm.csv.result.headers[i]
          });
      }
      vm.questions = vm.csv.result.rows;
      $scope.$apply();
    }

    function importData() {
      if (!vm.group || vm.group.length === 0) {
        UIkit.modal.alert($translate.instant('ERROR.USER_EDIT.EMPTY_ORG_GROUP'));
        return;
      }
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      var questionList = [];
      _.each(vm.questions, function(question) {
        if (!question.removed) {
          var createQuestion = {};
          _.each(vm.headers, function(header, index) {
            if (header.name && !header.deleted) {
              createQuestion[header.name.toLowerCase()] = question[index];
              if (header.name.toLowerCase() === 'correct_option') {
                  createQuestion['correctOptions'] = question[index].split(';');
              }
              if (header.name.toLowerCase() === 'wrong_option') {
                createQuestion['wrongOptions'] = question[index].split(';');
              }
            }
          });
          createQuestion.category = vm.group[0];
          questionList.push(createQuestion);
        }
      });
      QuestionsService.bulkCreate({
        questions: questionList
      }, function() {
        modal.hide();
        $window.location.reload();
      }, function(errorResponse) {
        modal.hide();
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="uk-icon-ban"></i> Question import error!'
        });
      });
    }

    function selectedGroup(groups) {
      vm.group = groups;
    }
  }

}(window.UIkit));
