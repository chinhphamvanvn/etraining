(function() {
	'use strict';

	// Courses controller
	angular
		.module('lms')
		.controller('ProgramsProgressboardController', ProgramsProgressboardController);

	ProgramsProgressboardController.$inject = [ '$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'gradeResolve', 'userResolve', 'Notification', 'CourseEditionsService', 'CertificatesService', 'CourseMembersService', 'EditionSectionsService', 'treeUtils', 'ExamsService', 'AttemptsService', 'QuestionsService', 'CompetencyAchievementsService', 'courseUtils', '$q', '$translate', '_' ];

	function ProgramsProgressboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, user, Notification, CourseEditionsService, CertificatesService, CourseMembersService, EditionSectionsService, treeUtils, ExamsService, AttemptsService, QuestionsService, CompetencyAchievementsService, courseUtils, $q, $translate, _) {
		var vm = this;
		vm.member = member;
		vm.certify = certify;
		vm.user = user;

		

		function certify(member) {
			var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
			member.$complete({teacherId:vm.user._id},function() {
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
}());