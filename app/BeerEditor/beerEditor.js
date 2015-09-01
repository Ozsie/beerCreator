'use strict';

angular.module('beerCreator.beerEditor', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/beerEditor', {
    templateUrl: 'beerEditor/beerEditor.html',
    controller: 'BeerEditorCtrl'
  });
}])

.controller('BeerEditorCtrl', ['$scope', '$http', 'BeerStyles', 'ColorConversion', 'Bitterness', 'Alcohol', 'Ingredients', function($scope, $http, BeerStyles, ColorConversion, Bitterness, Alcohol, Ingredients) {
    $scope.beerList = [];
    
    $scope.loadBeers = function() {
        $scope.beerStyles = BeerStyles.query({}, function(styles) {
            $scope.beerStyles = styles;
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
        if ($scope.openIndex === index) {
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
            $scope.beerList[index] = angular.copy($scope.revertTo);
            delete $scope.revertTo;
            $scope.editIndex = -1;
        } else {
            $scope.revertTo = angular.copy(beer);
            $scope.editIndex = index;
        }
    };
    
    $scope.save = function(beer, index) {
        $scope.revertTo = beer;
    };
    
    $scope.deleteIngredient = function(beer, ingredient, ingredientType, index) {
        ingredientType.splice(index, 1);
    };
    
    $scope.addIngredient = function(beer) {
        $scope.showAdd = !$scope.showAdd;
    };
    
    $scope.loadBeers();
    
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
}]);