import * as underscore from 'underscore';

export default  
angular
.module('UnderscoreModule', [])
.factory('_', [ function() {
  return underscore;
}]);