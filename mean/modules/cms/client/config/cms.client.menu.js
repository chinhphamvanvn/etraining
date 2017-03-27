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
			state : 'admin.workspace.cms',
			icon : 'school',
			position : 20,
			roles : [ 'admin' ]
		});
		menuService.addSubMenuItem('sidebar', 'admin.workspace.cms',{
	        title: 'PAGE.WORKSPACE.SIDEBAR.CMS.COURSES',
	        state : 'admin.workspace.cms.courses.list',
	        roles: ['admin'],
	        position: 1
	      });
	    menuService.addSubMenuItem('sidebar', 'admin.workspace.cms',{
	    	title: 'PAGE.WORKSPACE.SIDEBAR.CMS.PROGRAMS',
	        state : 'admin.workspace.cms.programs.list',
	        roles: ['admin'],
	        position: 2
	      });



	}
}());