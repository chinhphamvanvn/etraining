(function () {
    'use strict';

    angular
      .module('lms')
      .controller('CoursesGradeController', CoursesGradeController);

    CoursesGradeController.$inject = ['$scope', '$state', '$filter', '$compile','Authentication', 'Notification', '$timeout', '$location', '$window', 'courseResolve','editionResolve','schemeResolve','EditionSectionsService','treeUtils', '$translate', '_'];

    function CoursesGradeController($scope,$state, $filter, $compile, Authentication, Notification, $timeout, $location, $window, course, edition, scheme, EditionSectionsService, treeUtils, $translate, _) {
      var vm = this;
      vm.course = course;
      vm.edition = edition;
      vm.scheme = scheme;
      vm.update = update;
      vm.changeWeight = changeWeight;
      vm.changeFreezeMode = changeFreezeMode;
      vm.nodeList = [];
      vm.total = 0;

      EditionSectionsService.byEdition({editionId:vm.edition._id}, function(sections) {
          var nodes = treeUtils.buildCourseTree(sections);
          vm.nodeList = treeUtils.buildCourseListInOrder(nodes);
          vm.nodeList = _.filter(vm.nodeList,function(node) {
              return node.data.hasContent && node.data.contentType=='test';
          });

          _.each(vm.nodeList,function(node) {
              node.min = '0';
              node.max = '100';
              var mark = _.find(vm.scheme.marks, function(m) {
                 return m.quiz == node.data._id;
              });
              if (mark ) {
                  node.checked = true;
                  node.weight = mark.weight;
                  node.max = node.weight;
              } else {
                  node.weight =0;
                  node.checked = false;
              }
              vm.total += node.weight;
          })
      });

      function update() {
          vm.scheme.marks = _.map(vm.nodeList,function(obj) {
              return  {quiz: obj.data._id, weight: obj.weight};
          });
          vm.scheme.$update(function () {
              Notification.success({ message: '<i class="uk-icon-ok"></i> Grade scheme  created successfully!' });
             }, function (errorResponse) {
               Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Grade scheme updated error!' });
           });
      }

      function changeFreezeMode() {
          var freezeNodes  = _.filter(vm.nodeList,function(n) {
              return n.checked;
          });
          var activeNodes  = _.filter(vm.nodeList,function(n) {
              return !n.checked;
          });
          var sum = 0;
          _.each(freezeNodes,function(n) {sum = sum + n.weight});
          _.each(activeNodes,function(n) {
             n.max = (100 - sum)+'';
          });
      }

      function changeWeight(node) {
          var weight = node.weight;
          var balanceNodes  = _.filter(vm.nodeList,function(n) {
              return n.id != node.id && !n.checked && n.weight >0;
          });
          var sum = 0;
          _.each(vm.nodeList,function(n) {sum = sum + n.weight});
          var offset = sum - 100;
          vm.total = offset > 0 ? 100: sum;
          if (balanceNodes.length>0 && offset > 0) {
              var i = 0;
              while (offset >0) {
                  balanceNodes[i].weight--;
                  offset--;
                  i = (i+1) % balanceNodes.length;
              }
          }

      }

    }

  }());
