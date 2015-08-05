'use strict';

angular.module('beerCreator.filters')

.filter('yeastType', [function() {
  return function(type) {
    switch (type) {
        case 'ale':
            return "Ale";
        case 'lager':
            return "Lager";
        case 'wheat':
            return "Vete";
        case 'wine':
            return "Vin";
        case 'champagne':
            return "Champagne";
    }
  };
}])
.filter('flocculation', [function() {
  return function(flocculation) {
    switch (flocculation) {
        case 'low':
            return "Låg";
        case 'medium':
            return "Mellan";
        case 'high':
            return "Hög";
        case 'veryHigh':
            return "Väldigt hög";
    }
  };
}]);
