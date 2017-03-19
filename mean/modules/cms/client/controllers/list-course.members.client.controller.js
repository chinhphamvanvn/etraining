(function() {
	'use strict';

	angular
		.module('cms')
		.filter("classFilter", [ '_', function(_) {
			return function(students, classroom) {
				return _.filter(students, function(student) {
					if (!student.classroom)
						return false;
					if (student.classroom._id == classroom._id || student.classroom == classroom._id)
						return true;
					return false;
				});

			};
		} ]);

	angular
		.module('cms')
		.controller('CourseMembersController', CourseMembersController);

	CourseMembersController.$inject = [ '$scope', '$state', '$filter', '$compile', 'Authentication', 'AdminService', 'GroupsService', 'courseResolve', 'editionResolve', '$timeout', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Notification', '$q', 'CourseMembersService', 'ClassroomsService', '$translate', 'treeUtils', '_' ];

	function CourseMembersController($scope, $state, $filter, $compile, Authentication, AdminService, GroupsService, course, edition, $timeout, $location, $window, DTOptionsBuilder, DTColumnDefBuilder, Notification, $q, CourseMembersService, ClassroomsService, $translate, treeUtils, _) {
		var vm = this;
		vm.course = course;
		vm.edition = edition;
		vm.classroom = new ClassroomsService();
		vm.selectStudentGroup = selectStudentGroup;
		vm.selectTeacherGroup = selectTeacherGroup;
		vm.selectTeachers = selectTeachers;
		vm.selectStudents = selectStudents
		vm.suspend = suspend;
		vm.activate = activate;
		vm.remove = remove;
		vm.addClassroom = addClassroom;
		vm.editClassroom = editClassroom;
		vm.removeClassroom = removeClassroom;
		vm.displayUsers = [];

		$timeout(function() {

			var $class_start = $('#uk_class_start'),
				$class_end = $('#uk_class_end');

			var start_date = UIkit.datepicker($class_start, {
				format : 'DD.MM.YYYY'
			});

			var end_date = UIkit.datepicker($class_end, {
				format : 'DD.MM.YYYY'
			});
			$class_start.on('change', function() {
				end_date.options.minDate = $class_start.val();
				vm.classroom.startDate = moment($class_start.val(), 'DD.MM.YYYY');
			});

			$class_end.on('change', function() {
				start_date.options.maxDate = $class_end.val();
				vm.classroom.endDate = moment($class_end.val(), 'DD.MM.YYYY');
			});
		}, 1000);



		CourseMembersService.byCourse({
			courseId : vm.course._id
		}, function(data) {
			vm.teachers = _.filter(data, function(item) {
				return item.role == 'teacher' && item.member;
			});
			vm.students = _.filter(data, function(item) {
				return item.role == 'student' && item.member;
			});
		});

		vm.classConfig = {
			create : false,
			maxItems : 1,
			valueField : 'value',
			labelField : 'title',
			searchField : 'title'
		};
		vm.classOptions = [];

		vm.classes = ClassroomsService.byCourse({
			courseId : vm.course._id
		}, function() {
			vm.classOptions = _.map(vm.classes, function(obj) {
				return {
					id : obj._id,
					title : obj.name,
					value : obj._id
				}
			});
			_.each(vm.classes, function(classroom) {
				var now = new Date();
				var startDate = classroom.startDate ? new Date(classroom.startDate) : null;
				var endDate = classroom.endDate ? new Date(classroom.endDate) : null;
				if (startDate) {
					if (startDate.getTime() > now.getTime())
						classroom.titleClass = 'uk-accordion-title-warning';
					else if (endDate) {
						if (endDate.getTime() > now.getTime())
							classroom.titleClass = 'uk-accordion-title-success';
						else
							classroom.titleClass = '';
					} else
						classroom.titleClass = 'uk-accordion-title-success';
				} else {
					if (endDate) {
						if (endDate.getTime() > now.getTime())
							classroom.titleClass = 'uk-accordion-title-success';
						else
							classroom.titleClass = '';
					} else
						classroom.titleClass = '';
				}
			});
		});

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

		function remove(member) {
			UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
				member.$remove(function() {
					if (member.role == 'teacher')
						vm.teachers = _.reject(vm.teachers, function(item) {
							return item._id == member._id;
						});
					if (member.role == 'student')
						vm.students = _.reject(vm.students, function(item) {
							return item._id == member._id;
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
					return teacher.member._id == user._id && teacher.status == 'active';
				});
				if (!exist) {
					var member = new CourseMembersService();
					member.member = user._id;
					member.registerAgent = Authentication.user._id;
					member.course = vm.course._id;
					member.edition = vm.edition._id;
					member.status = 'active';
					member.role = 'teacher';
					member.registered = new Date();
					member.$save(function() {
						vm.teachers.push(member);
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
					return student.member._id == user._id && student.status == 'active';
				});
				// if course is self-study, then allow single enrollment per user
				if (!exist) {
					var member = new CourseMembersService();
					member.course = vm.course._id;
					member.member = user._id;
					member.edition = vm.edition._id;
					if (vm.selectedClass)
						member.classroom = vm.selectedClass;
					member.registerAgent = Authentication.user._id;
					member.status = 'active';
					member.enrollmentStatus = 'registered';
					member.role = 'student';
					member.registered = new Date();
					member.$save(function() {
						Notification.success({
							message : '<i class="uk-icon-check"></i> Member ' + user.displayName + 'enroll successfully!'
						});
						vm.students.push(member);
					}, function(errorResponse) {
						Notification.error({
							message : errorResponse.data.message,
							title : '<i class="uk-icon-ban"></i> Member ' + user.displayName + 'failed to enroll successfully!'
						});
					});
				}
				// if course is group model, then allow to change classroom
				else if (exist && course.model == 'group') {
					exist.classroom = vm.selectedClass;
					exist.$update(function() {
						Notification.success({
							message : '<i class="uk-icon-check"></i> Member ' + user.displayName + 'updated successfully!'
						});
					}, function(errorResponse) {
						Notification.error({
							message : errorResponse.data.message,
							title : '<i class="uk-icon-ban"></i> Member ' + user.displayName + 'failed to updated!'
						});
					});
				}
			})
		}

		function addClassroom() {
			vm.classroom.course = vm.course._id;
			vm.classroom.$save(function() {
				Notification.success({
					message : '<i class="uk-icon-check"></i> Class saved successfully!'
				});
				$window.location.reload();
			}, function(errorResponse) {
				Notification.error({
					message : errorResponse.data.message,
					title : '<i class="uk-icon-ban"></i> Class saved failed!'
				});
			});
		}

		function editClassroom(classroom) {
			UIkit.modal.prompt($translate.instant('MODEL.CLASSROOM.NAME'), '', function(val) {
				classroom.name = val;
				classroom.$update(function(response) {
					Notification.success({
						message : '<i class="uk-icon-ok"></i> Classroom updated successfully!'
					});
					reloadTree();
				}, function(errorResponse) {
					Notification.error({
						message : errorResponse.data.message,
						title : '<i class="uk-icon-ban"></i> Classroom  updated error!'
					});
				});
			});
		}

		function removeClassroom(classroom) {
			if (_.find(vm.students, function(student) {
					return student.classroom && (student.classroom == classroom._id || student.classroom._id == classroom._id);
				}) || _.find(vm.teachers, function(teacher) {
					return teacher.classroom && (teacher.classroom == classroom._id || teacher.classroom._id == classroom._id);
				})) {
				UIkit.modal.alert($translate.instant('ERROR.CLASSROOM.REMOVE_UNEMPTY_CLASSROOM'));
				return;
			}
			classroom.$remove(function(response) {
				Notification.success({
					message : '<i class="uk-icon-ok"></i> Classroom removed successfully!'
				});
				vm.classes = _.reject(vm.classes, function(obj) {
					return obj._id == classroom._id;
				})
				reloadTree();
			}, function(errorResponse) {
				Notification.error({
					message : errorResponse.data.message,
					title : '<i class="uk-icon-ban"></i> Classroom  removed error!'
				});
			});
		}

		function suspend(member) {
			if (member.status == 'withdrawn') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot suspend withdraw member!'
				});
				return;
			}
			if (member.enrollmentStatus == 'completed') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot suspend member which completed the course!'
				});
				return;
			}
			member.status = 'suspended';
			member.$update(
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Member suspend successfully!'
					})
				},
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Member suspend failed!'
					});
				})
		}

		function activate(member) {
			if (member.status == 'withdrawn') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot activate withdraw member!'
				});
				return;
			}
			if (member.enrollmentStatus == 'completed') {
				Notification.error({
					message : '<i class="uk-icon-ban"></i> Cannot activate member which completed the course!'
				});
				return;
			}
			member.status = 'active';
			member.$update(
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Member activate successfully!'
					})
				},
				function() {
					Notification.success({
						message : '<i class="uk-icon-check"></i> Member activate failed!'
					});
				})
		}
	}



}());