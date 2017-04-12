// Achievements service used to communicate Achievements REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('CompetencyAchievementsService', CompetencyAchievementsService);

  CompetencyAchievementsService.$inject = ['$resource', '_transform'];

  function CompetencyAchievementsService($resource, _transform) {
    return $resource('/api/achievements/:achievementId', {
      achievementId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byUser: {
        method: 'GET',
        url: '/api/achievements/byUser/:achiever',
        isArray: true
      },
      byUserAndCompetency: {
        method: 'GET',
        url: '/api/achievements/byUserAndCompetency/:achiever/:competencyId'
      }
    });
  }
}());
