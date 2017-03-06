(function () {
  'use strict';

// Courses controller
  angular
    .module('lms')
    .controller('CoursesGradeboardController', CoursesGradeboardController);

  CoursesGradeboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'gradeResolve', 'userResolve', 'Notification', 'CourseEditionsService', 'CertificatesService', 'CourseMembersService', 'EditionSectionsService', 'treeUtils', '$translate', '_'];

  function CoursesGradeboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, user, Notification, CourseEditionsService, CertificatesService, CourseMembersService, EditionSectionsService, treeUtils, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.member = member;
    vm.certify = certify;
    vm.user = user;
    vm.gradescheme = gradescheme;

    // vm.examList = EditionSectionsService.byEdition({editionId: vm.edition._id}, function (sections) {
    //   var nodes = treeUtils.buildCourseTree(sections);
    //   vm.examList = treeUtils.buildCourseListInOrder(nodes);
    //
    //   vm.examList = _.filter(vm.examList, function (node) {
    //     return node.data.hasContent && node.data.contentType == 'test';
    //   });
    //
    //   _.each(vm.examList, function (node) {
    //     node.min = '0';
    //     node.max = '100';
    //     var mark = _.find(vm.gradescheme.marks, function (m) {
    //       return m.quiz == node.data._id;
    //     });
    //     if (mark) {
    //       node.checked = true;
    //       node.weight = mark.weight;
    //       node.max = node.weight;
    //     } else {
    //       node.weight = 0;
    //       node.checked = false;
    //     }
    //     vm.total += node.weight;
    //   });
    // });

    function examPromise() {
      return EditionSectionsService.byEdition({editionId: vm.edition._id}, function (sections) {
        // var nodes = treeUtils.buildCourseTree(sections);
        // vm.examList = treeUtils.buildCourseListInOrder(nodes);
        //
        // vm.examList = _.filter(vm.examList, function (node) {
        //   return node.data.hasContent && node.data.contentType == 'test';
        // });
        //
        // _.each(vm.examList, function (node) {
        //   node.min = '0';
        //   node.max = '100';
        //   var mark = _.find(vm.gradescheme.marks, function (m) {
        //     return m.quiz == node.data._id;
        //   });
        //   if (mark) {
        //     node.checked = true;
        //     node.weight = mark.weight;
        //     node.max = node.weight;
        //   } else {
        //     node.weight = 0;
        //     node.checked = false;
        //   }
        //   vm.total += node.weight;
        // });
      }).$promise;
    }

    // vm.members = CourseMembersService.byCourse({courseId: vm.course._id}, function () {
    //   vm.members = _.filter(vm.members, function (m) {
    //     return m.role == 'student';
    //   });
    //
    //   _.each(vm.members, function (member) {
    //     CertificatesService.byMember({memberId: member._id}, function (certificate) {
    //       member.certificate = certificate;
    //     }, function () {
    //       member.certificate = null;
    //     })
    //   })
    // });

    function membersPromise() {
      return CourseMembersService.byCourse({courseId: vm.course._id}, function () {
      }).$promise;
    }

    membersPromise()
      .then(function (members) {
        vm.members = _.filter(members, function (m) {
          return m.role == 'student';
        });

        _.each(vm.members, function (member) {
          CertificatesService.byMember({memberId: member._id}, function (certificate) {
            member.certificate = certificate;
          }, function () {
            member.certificate = null;
          })
        })
      }).then(function() {
        return examPromise();
      }).then(function(sections) {
        vm.sections = sections;
        // Get examList information
        var nodes = treeUtils.buildCourseTree(sections);
        vm.examList = treeUtils.buildCourseListInOrder(nodes);

        vm.examList = _.filter(vm.examList, function (node) {
          return node.data.hasContent && node.data.contentType == 'test';
        });

        _.each(vm.examList, function (node) {
          node.min = '0';
          node.max = '100';
          var mark = _.find(vm.gradescheme.marks, function (m) {
            return m.quiz == node.data._id;
          });
          if (mark) {
            node.checked = true;
            node.weight = mark.weight;
            node.max = node.weight;
          } else {
            node.weight = 0;
            node.checked = false;
          }
          vm.total += node.weight;
        });
      });

    function certify(member) {
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      var certificate = new CertificatesService();
      certificate.member = member._id;
      certificate.course = vm.course._id;
      certificate.edition = vm.edition._id;
      certificate.issueDate = new Date();
      certificate.authorizer = vm.user._id;
      certificate.$save(function () {
        member.certificate = certificate;
        modal.hide();
      });
    }
  }
}());
