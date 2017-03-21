(function() {
	'use strict';

	angular
		.module('cms')
		.run(menuConfig);

	menuConfig.$inject = [ 'menuService' ];

	function menuConfig(menuService) {
		// Set top bar menu items
		menuService.addMenuItem('sidebar', {
			title : 'PAGE.WORKSPACE.SIDEBAR.CMS',
			state : 'admin.workspace.cms.courses.list',
			icon : 'school',
			position : 20,
			roles : [ 'admin' ]
		});




	}
}());