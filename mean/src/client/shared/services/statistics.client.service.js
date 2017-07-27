(function() {
  'use strict';

  angular
    .module('shared')
    .factory('statistics', [
      function() {
        function unpack(str) {
          var bytes = [];
          for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            bytes.push(char & 0xFF);
          }
          return bytes;
        }
        function mean(bytes) {
          if (bytes.length === 0)
            return 0;
          var sum =0;
          for(var i=0;i < bytes.length; i++)
            sum += bytes[i];
          return sum / bytes.length;
        }
        return {
          correlation: function(str1, str2) {
            var i;
            var bytes1 = unpack(str1);
            var bytes2 = unpack(str2);
            var n = bytes1.length > bytes2.length ? bytes1.length : bytes2.length;
            for (i = bytes1.length; i < n; i++)
              bytes1.push(0);
            for (i = bytes2.length; i < n; i++)
              bytes2.push(0);
            var mean1 = mean(bytes1);
            var mean2 = mean(bytes2);
            var num = 0;
            var factor1 = 0;
            var factor2 = 0;
            for (var i = 0; i < n; ++i) {
              var x = bytes1[i];
              var y = bytes2[i];
              num += (x - mean1) * (y - mean2);
              factor1 += (x - mean1) * (x - mean1)
              factor2 += (y - mean2) * (y - mean2)
            }
            var corr = num / Math.sqrt(factor1) / Math.sqrt(factor2);
            // correlation is just a normalized covariation
            return Math.abs(Math.floor(corr * 100 ));

          },
        };
      }
    ]);
}());
