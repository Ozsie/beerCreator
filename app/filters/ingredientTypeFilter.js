'use strict';

angular.module('beerCreator.filters', [])

.filter('ingredientType', [function() {
  return function(type) {
    switch (type) {
        case 'hops':
            return "Humle";
        case 'misc':
            return "Övrigt";
        case 'yeast':
            return "Jäst";
        default:
            return 'Malt';
    }
  };
}]);
