// Groups service used to communicate Groups REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('GroupsService', GroupsService);

  GroupsService.$inject = ['$resource'];

  function GroupsService($resource) {
    return $resource('/api/groups/:groupId', {
        groupId: '@_id'
      },
      {
        update: {
          method: 'PUT'
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
        listGroupBySearchCourse: {
          url: '/api/groups/search',
          method: 'GET',
          isArray: true
        }
      });
  }
}());
