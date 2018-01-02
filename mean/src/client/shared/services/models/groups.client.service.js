// Groups service used to communicate Groups REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('GroupsService', GroupsService);

  GroupsService.$inject = ['$resource', '_transform'];

  function GroupsService($resource, _transform) {
    return $resource('/api/groups/:groupId', {
      groupId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byCategory: {
        url: '/api/groups/byCategory/:category',
        method: 'GET',
        isArray: true
      },
      listOrganizationGroup: {
        url: '/api/groups/organization',
        method: 'GET',
        isArray: true
      },
      listCourseGroup: {
        url: '/api/groups/course',
        method: 'GET',
        isArray: true
      },
      listLibraryGroup: {
        url: '/api/groups/library',
        method: 'GET',
        isArray: true
      },
      listCompetencyGroup: {
        url: '/api/groups/competency',
        method: 'GET',
        isArray: true
      },
      listQuestionGroup: {
        url: '/api/groups/question',
        method: 'GET',
        isArray: true
      }
    });
  }
}());
