(function() {
  'use strict';

  angular
    .module('shared')
    .filter('momentDate', function() {
      return function(x, date_format_i, date_format_o) {
        if (x) {
          if (date_format_i) {
            return moment(x, date_format_i).format(date_format_o);
          } else {
            return moment(new Date(x)).format(date_format_o);
          }
        } else
          return null;
      };
    });
}());
