'use strict';

angular.module('beerCreator.ingredients', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ingredients', {
    templateUrl: 'ingredients/ingredients.html',
    controller: 'IngredientsCtrl'
  });
}])

.controller('IngredientsCtrl', ['$scope', '$http', 'Ingredients', 'ColorConversion', function($scope, $http, Ingredients, ColorConversion) {
        
    $scope.selectedList = 'malt';
        
    Ingredients.grains().query({}, function(grains) {
        $scope.grainList = grains;
    });
        
    Ingredients.hops().query({}, function(hops) {
        $scope.hopList = hops;
    });
        
    Ingredients.yeasts().query({}, function(yeasts) {
        $scope.yeastList = yeasts;
    });
        
    Ingredients.misc().query({}, function(misc) {
        $scope.miscList = misc;
    });
    
    $scope.getColor = function(grain) {
        var rgb = ColorConversion.convert(grain.color);
        return rgb;
    };
    
    $scope.getInvertedColor = function(grain) {
        var rgb = $scope.getColor(grain)
        var inverted = ColorConversion.invert(rgb)
        return inverted;
    };
    
    $scope.selectList = function(type) {
        $scope.selectedList = type;
    };
}]);