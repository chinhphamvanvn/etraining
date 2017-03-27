(function() {
	'use strict';

	// Focus the element on page load
	// Unless the user is on a small device, because this could obscure the page with a keyboard

	angular.module('cms')
		.directive('courseView', [ 'GroupsService', 'CoursesService', 'CompetenciesService', '$q', '_', courseView ]);

	function courseView(GroupsService, CoursesService, CompetenciesService, $q, _) {
		return {
			scope : {
				course : "="
			},
			templateUrl : '/modules/cms/client/directives/course-view/view-course.directive.client.view.html',
			link : function(scope, element, attributes) {
				if (!scope.course.loaded) {
					scope.course.loaded = true;
					if (scope.course.group)
						scope.course.group = GroupsService.get({
							groupId : scope.course.group
						});

					var allPromise = [];
					_.each(scope.course.prequisites, function(courseId) {
						allPromise.push(CoursesService.get({
							courseId : courseId
						}).$promise);
					});
					$q.all(allPromise).then(function(prequisites) {
						scope.course.prequisites = prequisites;
					});

					var allCompetenciesPromise = [];
					_.each(scope.course.competencies, function(competencyId) {
            allCompetenciesPromise.push(CompetenciesService.get({
              competencyId: competencyId
            }).$promise);
          });
					$q.all(allCompetenciesPromise).then(function(competencies) {
					  scope.course.competencies = competencies;
          });
				}
			}
		}
	}
}());
