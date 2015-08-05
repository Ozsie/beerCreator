'use strict';

angular.module('beerCreator.filters')

.filter('miscType', [function() {
  return function(type) {
    switch (type) {
        case 'other':
            return "Övrigt";
        case 'fining':
            return "Klarning";
        case 'flavor':
            return "Smak";
        case 'spice':
            return "Krydda";
        case 'herb':
            return "Ört";
        case 'waterAgent':
            return "Vattenbehandling";
    }
  };
}])
.filter('miscUseIn', [function() {
  return function(useIn) {
    switch (useIn) {
        case 'primary':
            return "Jäsning, primär";
        case 'secondary':
            return "Jäsning, sekundär";
        case 'boil':
            return "Kokning";
        case 'bottling':
            return "Buteljering";
        case 'mash':
            return "Mäskning";
        default:
            return useIn;
    }
  };
}])
.filter('miscUseFor', [function() {
  return function(useFor) {
    switch (useFor) {
        case 'Fermentation':
            return "Jäsning";
        case 'Water Agent':
            return "Vattenbehandling";
        case 'Preservative':
            return "Konserveringsmedel";
        case 'Clarity':
            return "Klarning";
        case 'Mash pH':
            return "pH-balans, mäsk";
        default:
            return useFor;
    }
  };
}]);
