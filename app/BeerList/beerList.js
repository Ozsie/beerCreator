'use strict';

angular.module('beerCreator.beerList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/beerList', {
    templateUrl: 'beerList/beerList.html',
    controller: 'BeerListCtrl'
  });
}])

.controller('BeerListCtrl', ['$scope', '$http', 'BeerStyles', 'ColorConversion', 'Bitterness', 'Alcohol', function($scope, $http, BeerStyles, ColorConversion, Bitterness, Alcohol) {
    $scope.beerList = [];
    
    $scope.loadBeers = function() {
        $scope.beerStyles = BeerStyles.query({}, function(styles) {
            $scope.beerStyles = styles;
            $http.get("/BeerCreator/beerlist.json").success(function(data, status) {
                if (data) {
                    $scope.beerList = data.beers;
                    for (var index in $scope.beerList) {
                        var beer = $scope.beerList[index];
                        var style = beer.style;
                        var fullStyle = $scope.findStyle(style, $scope.beerStyles);
                        beer.fullStyle = fullStyle;
                    }
                }
            });
        });
    };
    
    $scope.findStyle = function(id, styles) {
        for (var index in styles) {
            var style = styles[index];
            if (parseInt(style.id) === id) {
                return style;
            } else if (style.styles) {
                for (var subIndex in style.styles) {
                    var subStyle = style.styles[subIndex];
                    if (parseInt(subStyle.id) === id) {
                        return subStyle;
                    }
                }
            }
        }
    };
    
    $scope.toggle = function(beer, index) {
        if ($scope.openIndex == index) {
            $scope.openIndex = -1;
        } else {
            $scope.openIndex = index;
        }
    };
    
    $scope.getColor = function(beer) {
        var ebc = ColorConversion.calculateTotalEBC(beer);
        var rgb = ColorConversion.convert(ebc);
        beer.color = ebc;
        return rgb;
    };
    
    $scope.getInvertedColor = function(beer) {
        var rgb = $scope.getColor(beer)
        var inverted = ColorConversion.invert(rgb)
        return inverted;
    };
    
    $scope.getIBU = function(beer) {
        return Bitterness.tinseth(beer);
    };
    
    $scope.getABV = function(beer) {
        Alcohol.calculateFinalGravity(beer);
        return Alcohol.calculateABV(beer);
    }
    
    $scope.getOG = function(beer) {
        return Alcohol.calculateOriginalGravity(beer);
    }
    
    $scope.getFG = function(beer) {
        return Alcohol.calculateFinalGravity(beer);
    }
    
    $scope.getPercentage = function(beer, malt) {
        var totalAmount = 0;
        for (var index in beer.ingredients.malts) {
            totalAmount += beer.ingredients.malts[index].amount;
        }
        
        var percent = (malt.amount / totalAmount) * 100;
        return percent;
    };
    
    $scope.edit = function(beer, index) {
        if ($scope.editIndex === index) {
            $scope.editIndex = -1;
        } else {
            $scope.editIndex = index;
        }
    };
    
    $scope.loadBeers();
}]);