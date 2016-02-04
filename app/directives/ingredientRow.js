angular.module('beerCreator.directives', []).directive('ingredientRow', ['$timeout', function () {
    return {
        restrict: 'E',
        scope: {
          value1: '=value1',
          label1: '=label1',
          type1: '=type1',
          value2: '=value2',
          label2: '=label2',
          type2: '=type2',
          onlyOne: '=one'
        },
        templateUrl: 'directives/ingredientRow.html'
    };
}]);