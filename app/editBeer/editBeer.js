'use strict';

angular.module('beerCreator.editBeer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editBeer', {
    templateUrl: 'editBeer/editBeer.html',
    controller: 'EditBeerCtrl'
  });
}])

.controller('EditBeerCtrl', ['$scope', '$http', 'Ingredients', 'ColorConversion', 'EditBeer', 'BeerStyles', function($scope, $http, Ingredients, ColorConversion, EditBeer, BeerStyles) {
        $scope.beerStyles = BeerStyles.query({}, function(styles) {
            $scope.styles = styles;
            $scope.beer = EditBeer.getBeerToEdit();

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
    
    $scope.save = function() {
        $http.post("https://api.mongolab.com/api/1/databases/beercreator/collections/beerlist/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M",
                    JSON.stringify($scope.beer)).success(function(data, status) {
                        $scope.saved = true;
            });
    };
}]);