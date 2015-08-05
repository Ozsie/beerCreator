'use strict';

angular.module('beerCreator.filters')

.filter('hopType', [function() {
  return function(type) {
    switch (type) {
        case 'bitter':
            return "Bitter";
        case 'aroma':
            return "Arom";
        case 'both':
            return "Båda";
    }
  };
}]);
