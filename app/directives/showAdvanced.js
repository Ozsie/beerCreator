angular.module('beerCreator.directives').directive('showAdvanced', function () {
    return {
        restrict: 'E',
        scope: {
          showAdvanced: '=flag'
        },
        templateUrl: 'directives/showAdvanced.html'
    };
});