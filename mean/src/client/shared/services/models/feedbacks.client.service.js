// feedbacks service used to communicate feedbacks REST endpoints
(function () {
  'use strict';

  angular
    .module('shared.models')
    .factory('FeedbacksService', FeedbacksService);

  FeedbacksService.$inject = ['$resource', '_transform'];

  function FeedbacksService($resource, _transform) {
    return $resource('/api/feedbacks/:feedbackId', {
      feedbackId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: _transform.unpopulate
      },
      save: {
        method: 'POST',
        transformRequest: _transform.unpopulate
      },
      byAttempt: {
        method: 'GET',
        isArray: true,
        url: '/api/feedbacks/byAttempt/:attemptId'
      }
    });
  }
}());
