angular.module('beerCreator.directives').directive('infoSlider', function () {
    return {
        restrict: 'E',
        scope: {
          header: '=',
          value: '=',
          min: '=',
          max: '=',
          round: '='
        },
        link: function (scope) {
            if (!scope.round) {
                scope.round = 3;
            };
            
            scope.getPercentage = function() {
                scope.percentage = 0;
                scope.range = parseFloat(scope.max) - parseFloat(scope.min);
                if (parseFloat(scope.value) < parseFloat(scope.min)) {
                    scope.percentage = 0;
                } else if (parseFloat(scope.value) > parseFloat(scope.max)) {
                    scope.percentage = 100;
                } else {
                    scope.percentage = ((parseFloat(scope.value) - parseFloat(scope.min))/parseFloat(scope.range)) * 100;
                }
                return scope.percentage;
            };
        },
        templateUrl: 'directives/infoSlider.html'
    };
});