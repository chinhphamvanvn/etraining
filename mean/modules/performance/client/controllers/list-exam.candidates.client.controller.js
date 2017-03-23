(function() {
	'use strict';

	angular
		.module('performance')
		.controller('ExamCandidatesController', ExamCandidatesController);

	ExamCandidatesController.$inject = [ '$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', 'GroupsService', 'scheduleResolve', '$timeout', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Notification', '$q', 'ExamCandidatesService', '$translate', 'treeUtils', '_' ];

	function ExamCandidatesController($scope, $state, $filter, $compile, Authentication, AdminService, GroupsService, schedule, $timeout, $location, $window, DTOptionsBuilder, DTColumnDefBuilder, Notification, $q, ExamCandidatesService, $translate, treeUtils, _) {
		var vm = this;
		vm.schedule = schedule;
		vm.selectStudentGroup = selectStudentGroup;
		vm.selectTeacherGroup = selectTeacherGroup;
		vm.selectTeachers = selectTeachers;
		vm.selectStudents = selectStudents
		vm.suspend = suspend;
		vm.activate = activate;
		vm.remove = remove;


		ExamCandidatesService.byExam({
			examId : vm.schedule.exam
		}, function(data) {
			vm.teachers = _.filter(data, function(item) {
				return item.role == 'teacher' && item.candidate;
			});
			vm.students = _.filter(data, function(item) {
				return item.role == 'student' && item.candidate;
			});
		});

		vm.classConfig = {
			create : false,
			maxItems : 1,
			valueField : 'value',
			labelField : 'title',
			searchField : 'title'
		};


		function selectStudentGroup(groups) {
			vm.studentUsers = [];
			_.each(groups, function(group) {
				AdminService.byGroup({
					groupId : group
				}, function(users) {
					vm.studentUsers = vm.studentUsers.concat(users);
				})
			});
		}

		function selectTeacherGroup(groups) {
			vm.teacherUsers = [];
			_.each(groups, function(group) {
				AdminService.byGroup({
					groupId : group
				}, function(users) {
					vm.teacherUsers = vm.teacherUsers.concat(users);
				})
			});
		}

		function remove(candidate) {
			UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
				candidate.$remove(function() {
					if (candidate.role == 'teacher')
						vm.teachers = _.reject(vm.teachers, function(item) {
							return item._id == candidate._id;
						});
					if (candidate.role == 'student')
						vm.students = _.reject(vm.students, function(item) {
							return item._id == candidate._id;
						});
				});
			});
		}

		function selectTeachers() {
			var users = _.filter(vm.teacherUsers, function(user) {
				return user.selectedAsTeacher
			})
			_.each(users, function(user) {
				var exist = _.find(vm.teachers, function(teacher) {
					return teacher.candidate._id == user._id && teacher.status == 'active';
				});
				if (!exist) {
					var candidate = new ExamCandidatesService();
					candidate.candidate = user._id;
					candidate.registerAgent = Authentication.user._id;
					candidate.exam = vm.schedule.exam;
					candidate.schedule = vm.schedule._id;
					candidate.status = 'active';
					candidate.role = 'teacher';
					candidate.registered = new Date();
					candidate.$save(function() {
						vm.teachers.push(candidate);
					})
				}
			})
		}

		function selectStudents() {
			var users = _.filter(vm.studentUsers, function(user) {
				return user.selectedAsStudent
			})
			_.each(users, function(user) {
				var exist = _.find(vm.students, function(student) {
					return student.candidate._id == user._id && student.status == 'active';
				});
				if (!exist) {
					var candidate = new ExamCandidatesService();
					candidate.candidate = user._id;
					candidate.registerAgent = Authentication.user._id;
					candidate.exam = vm.schedule.exam;
					candidate.schedule = vm.schedule._id;
					candidate.status = 'active';
					candidate.role = 'student';
					candidate.registered = new Date();
					candidate.$save(function() {
						Notification.success({
							message : '<i class="uk-icon-check"></i> Candidate ' + candidate.user.displayName + 'enroll successfully!'
						});
						vm.students.push(candidate);
					}, function(errorResponse) {
						Notification.error({
							message : errorResponse.data.message,
							title : '<i class="uk-icon-ban"></i> Candidate ' + user.displayName + 'failed to enroll successfully!'
						});
					});
				}
			})
		}

		function suspend(candidate) {
			if (candidate.status == 'withdrawn') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot suspend withdraw candidate!'
				});
				return;
			}
			if (candidate.enrollmentStatus == 'completed') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot suspend candidate which completed the exam!'
				});
				return;
			}
			candidate.status = 'suspended';
			candidate.$update(
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Candidate suspend successfully!'
					})
				},
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Candidate suspend failed!'
					});
				})
		}

		function activate(candidate) {
			if (candidate.status == 'withdrawn') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot activate withdraw candidate!'
				});
				return;
			}
			if (candidate.enrollmentStatus == 'completed') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot activate candidate which completed the exam!'
				});
				return;
			}
			candidate.status = 'active';
			candidate.$update(
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Candidate activate successfully!'
					})
				},
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Candidate activate failed!'
					});
				})
		}
	}
}());