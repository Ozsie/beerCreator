'use strict';

angular.module('beerCreator.editBeer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editBeer', {
    templateUrl: 'editBeer/editBeer.html',
    controller: 'EditBeerCtrl'
  });
}])

.controller('EditBeerCtrl', ['$scope', '$http', 'Ingredients', 'ColorConversion', 'EditBeer', 'BeerStyles', 'Profiles', function($scope, $http, Ingredients, ColorConversion, EditBeer, BeerStyles, Profiles) {
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

        Profiles.equipment().query({}, function(equipment) {
            $scope.equipmentList = equipment;
        });

        Profiles.fermentationProfiles().query({}, function(fermentationProfiles) {
            $scope.fermentationProfiles = fermentationProfiles;
        });

        Profiles.mashProfiles().query({}, function(mashProfiles) {
            $scope.mashProfiles = mashProfiles;
        });
    });
    
    $scope.$watch(function() {
        return $scope.selectedIngredient;
    }, function() {
        if ($scope.selectedIngredient) {
            $scope.toggleIngredient('', -1);
            var list;
            var unit = "g";
            var type;
            if ($scope.newIngredientType === 'malt') {
                list = $scope.grainList;
                type = "malt";
            }
            if ($scope.newIngredientType === 'hops') {
                list = $scope.hopList;
                type = "hops";
            }
            if ($scope.newIngredientType === 'yeasts') {
                list = $scope.yeastList;
                type = "yeast";
                unit = "pkg";
            }
            if ($scope.newIngredientType === 'misc') {
                list = $scope.miscList;
                type = "misc";
                unit = undefined;
            }
            
            for (var index in list) {
                if (list[index].name === $scope.selectedIngredient) {
                    $scope.editedIngredient = angular.copy(list[index]);
                    if (unit) {
                        $scope.editedIngredient.unit = unit;
                    }
                    $scope.editedIngredient.type = type;
                    return;
                }
            }
        }
    }, true);
    
        
    $scope.$watch(function() {
        if ($scope.beer) {
            return $scope.beer.parentStyle;
        }
    }, function() {
        if ($scope.beer && $scope.beer.parentStyle) {
            for (var styleIndex in $scope.styles) {
                if ($scope.styles[styleIndex].id === $scope.beer.parentStyle) {
                    $scope.subStyles = $scope.styles[styleIndex].styles;
                    return;
                }
            }
        }
    }, true);
    
    $scope.$watch(function() {
        if ($scope.beer) {
            return $scope.beer.style;
        }
    }, function() {
        if ($scope.beer && $scope.beer.style) {
            for (var styleIndex in $scope.styles) {
                if ($scope.styles[styleIndex].id === $scope.beer.style) {
                    $scope.beer.fullStyle = angular.copy($scope.styles[styleIndex]);
                    return;
                } else if ($scope.styles[styleIndex].styles){
                    for (var subIndex in $scope.styles[styleIndex].styles) {
                        var subStyle = $scope.styles[styleIndex].styles[subIndex];
                        if (subStyle.id === $scope.beer.style) {
                            $scope.beer.fullStyle = angular.copy(subStyle);
                            return;
                        }
                    }
                }
            }
        }
    }, true);
    
    $scope.toggleIngredient = function(type, index) {
        if (type !== '' && index !== -1) {
            $scope.editedIngredient = undefined;
            $scope.selectedIngredient = undefined;
            $scope.newIngredientType = undefined;
        }
        
        if ($scope.editIndex !== index && $scope.editType !== type) {
            $scope.editIndex = index;
            $scope.editType = type;
        } else if ($scope.editIndex !== index && $scope.editType === type) {
            $scope.editIndex = index;
        } else if ($scope.editIndex === index && $scope.editType !== type) {
            $scope.editType = type;
        } else {
            $scope.editIndex = -1;
            $scope.editType = '';
        }
    };
    
    $scope.getPercentage = function(beer, malt) {
        var totalAmount = 0;
        for (var index in beer.ingredients.malts) {
            totalAmount += beer.ingredients.malts[index].amount;
        }
        
        var percent = (malt.amount / totalAmount) * 100;
        return percent;
    };
    
    $scope.getColor = function(grain) {
        var rgb = ColorConversion.convert(grain.color);
        return rgb;
    };
    
    $scope.getInvertedColor = function(grain) {
        var rgb = $scope.getColor(grain)
        var inverted = ColorConversion.invert(rgb)
        return inverted;
    };
    
    $scope.addFullStyle = function(style) {
        $scope.beer.fullStyle = angular.copy(style);
    };
    
    $scope.saveMalt = function() {
        $scope.beer.ingredients.malts.push(angular.copy($scope.editedIngredient));
        $scope.cancelNewIngredient();
    };
    
    $scope.saveHop = function() {
        $scope.beer.ingredients.hops.push(angular.copy($scope.editedIngredient));
        $scope.cancelNewIngredient();
    };
    
    $scope.cancelNewIngredient = function() {
        $scope.editedIngredient = undefined;
        $scope.selectedIngredient = undefined;
        $scope.newIngredientType = undefined;;
    };
    
    $scope.removeIngredient = function(index, type) {
        $scope.beer.ingredients[type].splice(index, 1);
    };
    
    $scope.updateBoilVolume = function() {
        if ($scope.beer.equipment && $scope.beer.equipment.boiler.calculatBoilVolume) {
            var afterMash = $scope.beer.equipment.mashLauterTun.volume;
            if ($scope.beer.equipment.mashLauterTun.adjustVolumeForDeadSpace) {
                afterMash -= $scope.beer.equipment.mashLauterTun.deadSpace;
            }
            
            var volume = (afterMash + $scope.beer.equipment.boiler.kettleTopUp) * 0.864;
            
            $scope.beer.equipment.boiler.boilVolume = Math.round(volume * 100) / 100;
        }
    };
    
    $scope.save = function() {
        var toSave = angular.copy($scope.beer);
        delete toSave.$$hashKey;
        $http.post("https://api.mongolab.com/api/1/databases/beercreator/collections/beerlist/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M",
                    JSON.stringify(toSave)).success(function(data, status) {
                        $scope.saved = true;
            });
    };
}]);