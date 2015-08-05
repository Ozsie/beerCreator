'use strict';

angular.module('beerCreator.filters', [])

.filter('grainType', [function() {
  return function(type) {
    switch (type) {
        case 'dryExtract':
            return "Torrt extrakt";
        case 'liquidExtract':
            return "Flytande extrakt";
        case 'hull':
            return "Skal";
        case 'malt':
            return "Malt";
        case 'sugar':
            return 'Socker';
    }
  };
}]);
