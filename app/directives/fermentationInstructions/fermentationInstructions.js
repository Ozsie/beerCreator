angular.module('beerCreator.directives').controller('FermentationInstructionsCtrl', function($scope){
});

angular.module('beerCreator.directives').directive('fermentationInstructions', function() {
    return {
        restrict: 'E',
        replace: true,
        controller: 'FermentationInstructionsCtrl',
        scope: {
            beer: '='
        },
        templateUrl: 'directives/fermentationInstructions/fermentationInstructions.html',
        link: function(scope, element, attrs, fn) {
        }
    };
});