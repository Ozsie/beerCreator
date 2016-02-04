angular.module('beerCreator.directives').directive('ingredientButtonRow', function () {
    return {
        restrict: 'E',
        scope: {
          save: '&',
          cancel: '&'
        },
        templateUrl: 'directives/ingredientButtonRow.html'
    };
});