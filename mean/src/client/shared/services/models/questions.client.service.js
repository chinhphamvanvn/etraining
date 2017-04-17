// Questions service used to communicate Questions REST endpoints
(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('QuestionsService', QuestionsService);

  QuestionsService.$inject = ['$q', '$resource', '_transform'];

  function QuestionsService($q, $resource, _transform) {
    var Questions =  $resource('/api/questions/:questionId', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT',
        transformRequest: function(question) {
          if (question.svgData)
            question.svgData = angular.toJson(question.svgData);
          question = _transform.unpopulate(question);
          return question;
        }
      },
      save: {
        method: 'POST',
        transformRequest: function(question) {
          question = _transform.unpopulate(question);
          if (question.svgData)
            question.svgData = angular.toJson(question.svgData);
          return question;
        }
      },
      bulkCreate: {
        method: 'POST',
        url: '/api/questions/bulk/:questions'
      },
      byCategoryAndLevel: {
        method: 'GET',
        url: '/api/questions/byCategoryAndLevel/:groupId/:level',
        isArray: true
      },
      byCategory: {
        method: 'GET',
        url: '/api/questions/byCategory/:groupId',
        isArray: true
      },
      byIds: {
        method: 'GET',
        url: '/api/questions/byIds/:questionIds',
        isArray: true
      }
    });
    
    angular.extend(Questions, {
      saveRecursive: function(question) {
        function getPromise(q) {
          var allPromise = [];
          allPromise.push(q.$update().$promise);
          _.each(q.options, function(option) {
            allPromise.push(option.$update().$promise);
          });
          if (q.grouped) {
            _.each(q.subQuestions, function(subQ) {
              allPromise = allPromise.concat(getPromise(subQ));
            });            
          }
          return allPromise;
        }
        var promises = getPromise(question);
        return $q.all(promises); 
      }
    
      
    });
    return Questions;
  }
}());
