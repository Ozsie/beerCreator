angular.module('beerCreator.directives').directive('checkButton', ['$timeout', function () {
    return {
        restrict: 'E',
        scope: {
          toggle: '=',
          label: '=label'
        },
        templateUrl: 'directives/checkButton.html'
    };
}]);