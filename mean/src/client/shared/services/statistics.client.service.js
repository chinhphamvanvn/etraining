(function() {
  'use strict';

  angular
    .module('shared')
    .factory('statistics', [
      function() {
        function unpack(str) {
          var bytes = [];
          for(var i = 0; i < str.length; i++) {
              var char = str.charCodeAt(i);
              bytes.push(char >>> 8);
              bytes.push(char & 0xFF);
          }
          return bytes;
      }
        return {
          correlation: function(str1, str2) {
            var bytes1 = unpack(str1);
            var bytes2 = unpack(str2);
            var sx = 0.0;
            var sy = 0.0;
            var sxx = 0.0;
            var syy = 0.0;
            var sxy = 0.0;

            for(var i = 0; i < bytes1.length; ++i) {
              var x = bytes1[i];
              var y = bytes2[i];

              sx += x;
              sy += y;
              sxx += x * x;
              syy += y * y;
              sxy += x * y;
            }

            // covariation
            var cov = sxy / n - sx * sy / n / n;
            // standard error of x
            var sigmax = Math.sqrt(sxx / n -  sx * sx / n / n);
            // standard error of y
            var sigmay = Math.sqrt(syy / n -  sy * sy / n / n);

            // correlation is just a normalized covariation
            return cov / sigmax / sigmay;
            
          },
        };
      }
    ]);
}());
