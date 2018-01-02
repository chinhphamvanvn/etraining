(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesGradeboardController', CoursesGradeboardController);

  CoursesGradeboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'gradeResolve', 'userResolve', 'Notification', 'CourseEditionsService', 'CertificatesService', 'CourseMembersService', 'EditionSectionsService', 'treeUtils', 'ExamsService', 'AttemptsService', 'QuestionsService', 'CompetencyAchievementsService', 'courseUtils', '$q', '$translate', '_'];

  function CoursesGradeboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, user, Notification, CourseEditionsService, CertificatesService, CourseMembersService, EditionSectionsService, treeUtils, ExamsService, AttemptsService, QuestionsService, CompetencyAchievementsService, courseUtils, $q, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.member = member;
    vm.certify = certify;
    vm.user = user;
    vm.gradescheme = gradescheme;
    vm.scoreMap = {};

    function examPromise() {
      return EditionSectionsService.byEdition({
        editionId: vm.edition._id
      }, function(sections) {}).$promise;
    }

    function membersPromise() {
      return CourseMembersService.byCourse({
        courseId: vm.course._id
      }, function() {}).$promise;
    }

    membersPromise().then(function(members) {
      vm.members = _.filter(members, function(m) {
        return m.role === 'student';
      });

      _.each(vm.members, function(member) {
        CertificatesService.byMember({
          memberId: member._id
        }, function(certificate) {
          member.certificate = certificate;
        }, function() {
          member.certificate = null;
        });
      });
    }).then(function() {
      return examPromise();
    }).then(function(sections) { // Get examList information
      vm.sections = sections;

      var nodes = treeUtils.buildCourseTree(sections);
      vm.examList = treeUtils.buildCourseListInOrder(nodes);

      vm.examList = _.filter(vm.examList, function(node) {
        return node.data.hasContent && node.data.contentType === 'test';
      });

      _.each(vm.examList, function(node) {
        node.min = '0';
        node.max = '100';
        var mark = _.find(vm.gradescheme.marks, function(m) {
          return m.section === node.data._id;
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
    }).then(function() { // Get result of exam for each student
      vm.members.reduce(function(prev, curr) {
        return prev.then(function() {
          return courseUtils.memberScoreByCourse(curr, vm.edition).then(function(scores) {
            vm.scoreMap[curr._id] = {
              totalScore: scores.totalPercent,
              scores: scores.scores
            };
          });
        });
      }, $q.resolve()).then(function() { // Export to csv file
        var pass = $translate.instant('COMMON.PASS'),
          fall = $translate.instant('COMMON.FAIL'),
          displayName = $translate.instant('MODEL.USER.DISPLAY_NAME'),
          totalScore = $translate.instant('PAGE.LMS.MY_COURSES.GRADE_SCHEME'),
          result = $translate.instant('PAGE.LMS.MY_COURSES.COURSE_GRADE.EXAM_RESULT');
        vm.csvArray = [];
        vm.csvHeader = [];

        vm.csvHeader.push(displayName);
        vm.examList.forEach(function(exam) {
          vm.csvHeader.push(exam.data.name);
        });
        vm.csvHeader.push(totalScore);
        vm.csvHeader.push(result);

        vm.members.forEach(function(member) {
          var csvObj = {};
          csvObj[0 + 'name'] = member.member.displayName;
          vm.scoreMap[member._id].scores.forEach(function(score, index) {
            csvObj['score_' + index] = score.rawPercent;
          });
          csvObj.totalScore = vm.scoreMap[member._id].totalScore;
          if (member.enrollmentStatus === 'completed')
            csvObj.result = (vm.scoreMap[member._id].totalScore >= vm.gradescheme.benchmark) ? pass : fall;
          else
            csvObj.result = '';
          vm.csvArray.push(csvObj);
        });
      });
    });

    function certify(member) {
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      member.$complete({
        teacherId: vm.user._id
      }, function() {
        var certificate = new CertificatesService();
        certificate.member = member._id;
        certificate.course = vm.course._id;
        certificate.edition = vm.edition._id;
        certificate.issueDate = new Date();
        certificate.authorizer = vm.user._id;
        certificate.$grant(function() {
          member.certificate = true;
          modal.hide();
        });

      });
    }
  }
}(window.UIkit));
