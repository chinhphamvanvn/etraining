(function() {
  'use strict';

  angular
    .module('shared.models')
    .factory('_transform', ['_',
      function(_) {
        return {
          unpopulate: function(object) {
            _.each(Object.keys(object), function(prop) {
              var propVal = object[prop];
              if (typeof propVal === 'object' && propVal && '_id' in propVal) {
                object[prop] = propVal._id;
              }
            });
            return angular.toJson(object);
          }
        };
      }
    ]);
}());
