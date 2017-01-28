(function () {
  'use strict';

  angular
  .module('shared')
  .filter("jsonDate", function() {
      return function(x) {
          if(x) return new Date(x);
          else return null;
      };
  });
}());