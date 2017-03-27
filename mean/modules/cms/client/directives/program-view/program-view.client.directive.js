(function() {
	'use strict';

	// Focus the element on page load
	// Unless the user is on a small device, because this could obscure the page with a keyboard

	angular.module('cms')
		.directive('programView', [ 'CoursesService', 'CompetenciesService', '$q', '_', programView ]);

	function programView(CoursesService, CompetenciesService, $q, _) {
		return {
			scope : {
				program : "="
			},
			templateUrl : '/modules/cms/client/directives/program-view/view-program.directive.client.view.html',
			link : function(scope, element, attributes) {
				if (!scope.program.loaded) {
					scope.program.loaded = true;

					var allPromise = [];
					_.each(scope.program.courses, function(courseId) {
						allPromise.push(CoursesService.get({
							courseId : courseId
						}).$promise);
					});
					$q.all(allPromise).then(function(courses) {
						scope.program.courses = courses;
					});

					var allCompetenciesPromise = [];
					_.each(scope.program.competencies, function(competencyId) {
						allCompetenciesPromise.push(CompetenciesService.get({
							competencyId : competencyId
						}).$promise);
					});
					$q.all(allCompetenciesPromise).then(function(competencies) {
						scope.program.competencies = competencies;
					});
				}
			}
		}
	}
}());