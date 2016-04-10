angular.module('beerCreator.directives').directive('infoSlider', function () {
    return {
        restrict: 'E',
        scope: {
          header: '=',
          value: '=',
          min: '=',
          max: '='
        },
        templateUrl: 'directives/infoSlider.html'
    };
});