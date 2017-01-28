(function () {
  'use strict';

  angular
  .module('shared')
  .filter("trust", ['$sce', function($sce) {
      return function(htmlCode){
          return $sce.trustAsHtml(htmlCode);
      }
  }]);
}());