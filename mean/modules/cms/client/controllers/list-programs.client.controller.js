(function() {
	'use strict';

	angular
		.module('cms')
		.controller('CmsProgramsListController', CmsProgramsListController);

	CmsProgramsListController.$inject = [ '$scope', '$state', '$filter', '$compile', 'Authentication', 'CourseProgramsService', '$timeout', '$location', '$window', 'GroupsService', 'DTOptionsBuilder', 'DTColumnBuilder', 'Notification', '$q', 'treeUtils', '$translate', '_' ];

	function CmsProgramsListController($scope, $state, $filter, $compile, Authentication, CourseProgramsService, $timeout, $location, $window, GroupsService, DTOptionsBuilder, DTColumnBuilder, Notification, $q, treeUtils, $translate, _) {
		var vm = this;
		vm.remove = remove;

		vm.dtOptions = DTOptionsBuilder.fromFnPromise(CourseProgramsService.query().$promise).withOption('createdRow', function(row, data, dataIndex) {
			// Recompiling so we can bind Angular directive to the DT
			$compile(angular.element(row).contents())($scope);
		})
			.withPaginationType('full_numbers')
			.withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
				"<'uk-overflow-container'tr>" +
				"<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
			.withButtons([
				{
					extend : 'colvis',
					text : '<i class="uk-icon-file-pdf-o"></i> ' + $translate.instant("ACTION.COLUMN"),
					titleAttr : 'COL'
				}
			]);

		vm.dtColumns = [
			DTColumnBuilder.newColumn('name').withTitle($translate.instant('MODEL.PROGRAM.NAME')).withClass('withfix'),
			DTColumnBuilder.newColumn('code').withTitle($translate.instant('MODEL.PROGRAM.CODE')),,
			DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.PROGRAM.ENROLL_STATUS'))
				.renderWith(function(data, type, full, meta) {
					if (!data.enrollStatus)
						return '<span class="uk-badge uk-badge-danger">Nok</span>';
					else
						return '<span class="uk-badge uk-badge-success">Ok</span>';
				}),
			DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.PROGRAM.ENROLL_POLICY'))
				.renderWith(function(data, type, full, meta) {
					if (data.enrollPolicy == 'open')
						return $translate.instant('COMMON.ENROLL_POLICY.OPEN');
					if (data.enrollPolicy == 'censor')
						return $translate.instant('COMMON.ENROLL_POLICY.CENSOR');
				}),
			DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.PROGRAM.PRESENT_MODE'))
				.renderWith(function(data, type, full, meta) {
					if (data.displayMode == 'open')
						return $translate.instant('COMMON.PRESENT_MODE.ALL');
					if (data.displayMode == 'login')
						return $translate.instant('COMMON.PRESENT_MODE.LOGIN');
					if (data.displayMode == 'enroll')
						return $translate.instant('COMMON.PRESENT_MODE.ENROLLED');
				}),
			DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.PROGRAM.STATUS'))
				.renderWith(function(data, type, full, meta) {
					if (data.status == 'available')
						return '<span class="uk-badge uk-badge-success">Available</span>';
					if (data.status == 'draft')
						return '<span class="uk-badge uk-badge-default">Draft</span>';
					if (data.status == 'unavailable')
						return '<span class="uk-badge uk-badge-danger">N/A</span>';
				}),
			DTColumnBuilder.newColumn(null).withTitle($translate.instant('COMMON.ACTION')).notSortable()
				.renderWith(function(data, type, full, meta) {
					var action = '<a  ui-sref="admin.workspace.cms.program-members({programId:\'' + data._id + '\'})" data-uk-tooltip="{pos:\'bottom\'}" title="' + $translate.instant('ACTION.ENROLL') + '"><i class="md-icon material-icons uk-text-primary">group</i>  </a>' +					
						'<a  ui-sref="admin.workspace.cms.programs.edit({programId:\'' + data._id + '\'})" data-uk-tooltip="{pos:\'bottom\'}" title="' + $translate.instant('ACTION.EDIT') + '"><i class="md-icon material-icons">edit</i></a>' +
						'<a ui-sref="admin.workspace.cms.programs.view({programId:\'' + data._id + '\'})" data-uk-tooltip="{pos:\'bottom\'}" title="' + $translate.instant('ACTION.VIEW') + '"><i class="md-icon material-icons">info_outline</i></a>';
					return action;
				})
		];
		vm.dtInstance = {};


		function remove(id) {
			if (id == vm.course._id)
				return;
			UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
				CourseProgramsService.remove({
					programId : id
				}, function() {
					vm.reload = true;
					vm.dtInstance.reloadData(function() {}, true);
					Notification.success({
						message : '<i class="uk-icon-check"></i> Program deleted successfully!'
					});
				});
			});
		}


	}


}());