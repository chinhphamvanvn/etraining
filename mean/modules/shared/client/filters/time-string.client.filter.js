(function () {
  'use strict';

  angular
  .module('shared')
  .filter("timeString", function() {
      return function(secs) {
          function pad(num) {
              return ("0"+num).slice(-2);
          }
          var hh = Math.floor(secs / 3600);
          var mm = Math.floor((secs - hh*3600 ) /60);
          var ss = Math.floor(secs - hh*3600 - mm* 60);
          return  pad(hh)+"hr : "+pad(mm)+"m : "+pad(ss)+"s";
      };
  });
}());