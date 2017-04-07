/**
 * Created by thanhvk on 3/13/2017.
 */
(function() {
  'use strict';

  angular
    .module('shared')
    .filter('truncateWord', [function() {
      return function(text, limit) {
        if (!text) return;
        var words = text.split(' ');
        var truncateWords = words.slice(0, limit);
        truncateWords = truncateWords.join(' ');
        if (words.length > limit) {
          truncateWords += '...';
        }
        return truncateWords;
      };
    }]);
}());
