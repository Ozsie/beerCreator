'use strict';

angular.module('beerCreator.beerList', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/beerList', {
    templateUrl: 'beerList/beerList.html',
    controller: 'BeerListCtrl'
  });
}])

.controller('BeerListCtrl', ['$scope', '$http', '$location', '$firebaseArray', 'BeerStyles', 'ColorConversion', 'Bitterness', 'Alcohol', 'Ingredients', 'EditBeer', 'User', function($scope, $http, $location, $firebaseArray, BeerStyles, ColorConversion, Bitterness, Alcohol, Ingredients, EditBeer, User) {
    $scope.beerList = [];
    
    $scope.loadBeers = function() {
        $scope.beerStyles = BeerStyles.getStyles().$loaded().then(function(styles) {
            $scope.beerStyles = styles;
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/beerlist/" + User.authData.uid);
            $scope.beerList = $firebaseArray(ref);
            $scope.beerList.$loaded().then(function(data) {
                if (data) {
                    $scope.beerList = data;
                    for (var index in $scope.beerList) {
                        var beer = $scope.beerList[index];
                        var style = beer.style;
                        if (!beer.fullStyle) {
                            var fullStyle = $scope.findStyle(style, $scope.beerStyles);
                            beer.fullStyle = fullStyle;
                        }
                    }
                }
            });
            
            var refPublic = new Firebase("https://luminous-heat-8761.firebaseio.com/beerlist/public");
            $scope.beerListPublic = $firebaseArray(refPublic);
            $scope.beerListPublic.$loaded().then(function(data) {
                if (data) {
                    $scope.beerListPublic = data;
                    for (var index in $scope.beerListPublic) {
                        var beer = $scope.beerListPublic[index];
                        var style = beer.style;
                        if (!beer.fullStyle) {
                            var fullStyle = $scope.findStyle(style, $scope.beerStyles);
                            beer.fullStyle = fullStyle;
                        }
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
    
    $scope.edit = function(beer) {
        EditBeer.setBeerToEdit(beer);
        $location.path('editBeer');
    };
    
    $scope.newBeer = function() {
        EditBeer.setNewBeer();
        $location.path('editBeer');
    };
    
    $scope.loadBeers();
    
    Ingredients.grains().$loaded().then(function(grains) {
        $scope.grainList = grains;
    });
        
    Ingredients.hops().$loaded().then(function(hops) {
        $scope.hopList = hops;
    });
        
    Ingredients.yeasts().$loaded().then(function(yeasts) {
        $scope.yeastList = yeasts;
    });
        
    Ingredients.misc().$loaded().then(function(misc) {
        $scope.miscList = misc;
    });
    
    $scope.logout = function() {
        User.logout();
    };
}]);