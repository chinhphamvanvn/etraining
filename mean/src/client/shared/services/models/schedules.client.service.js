// Schedules service used to communicate Schedules REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('SchedulesService', SchedulesService);

  SchedulesService.$inject = ['$resource', '_transform'];

  function SchedulesService($resource, _transform) {
    return $resource('/api/schedules/:scheduleId', {
      scheduleId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      }
    });
  }
}());
