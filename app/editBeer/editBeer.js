'use strict';

angular.module('beerCreator.editBeer', ['ngRoute', 'ui.bootstrap', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editBeer', {
    templateUrl: 'editBeer/editBeer.html',
    controller: 'EditBeerCtrl'
  });
}])

.controller('EditBeerCtrl', ['$scope', '$firebaseArray', '$interval', '$location', 'Ingredients', 'ColorConversion', 'BeerStyles', 'Profiles', 'User', 'Bitterness', 'Alcohol', 'Page', 'Beer', function($scope, $firebaseArray, $interval, $location, Ingredients, ColorConversion, BeerStyles, Profiles, User, Bitterness, Alcohol, Page, Beer) {
    if (!User.authData) {
        $location.path('login');
    }
    
    $scope.ingredientSelect = [{name: 'Malt', value:'malt'},{name: 'Humle', value:'hops'},{name: 'Jäst', value:'yeasts'},{name: 'Övrigt', value:'misc'}];
    
    $scope.user = User;
    
    BeerStyles.getStyles().$loaded().then(function(styles) {
        if (!User || !User.authData) {
            return;
        }
        $scope.styles = styles;
        $scope.tempBeer = Beer.getBeerToEdit();
        $scope.beerColor = "#ffffff";
        
        if ($scope.tempBeer.$id) {
            $scope.beer = Beer.getBeer(User.authData.uid, $scope.tempBeer.$id);
            $scope.beer.$loaded().then(function (){
                $scope.beerColor = $scope.getColor($scope.beer);
                Page.setTitle("Beer Creator - " + $scope.beer.name);
                $scope.update();
            });
        } else {
            $scope.beer = $scope.tempBeer;
        }

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

        Profiles.equipment().$loaded().then(function(equipment) {
            $scope.equipmentList = equipment;
        });

        Profiles.fermentationProfiles().$loaded().then(function(fermentationProfiles) {
            $scope.fermentationProfiles = fermentationProfiles;
        });

        Profiles.mashProfiles().$loaded().then(function(mashProfiles) {
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
                if (list[index].$id === $scope.selectedIngredient) {
                    $scope.editedIngredient = angular.copy(list[index]);
                    if (unit) {
                        $scope.editedIngredient.unit = unit;
                    }
                    if ($scope.newIngredientType === 'yeasts') {
                        $scope.editedIngredient.useFor = $scope.editedIngredient.type;
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
        var rgb = $scope.getColor(grain);
        var inverted = ColorConversion.invert(rgb);
        return inverted;
    };
    
    $scope.addFullStyle = function(style) {
        $scope.beer.fullStyle = angular.copy(style);
    };
    
    $scope.saveMalt = function() {
        if (!$scope.beer.ingredients) {
            $scope.beer.ingredients = {};
        }
        if (!$scope.beer.ingredients.malts) {
            $scope.beer.ingredients.malts = [];
        }
        $scope.beer.ingredients.malts.push(angular.copy($scope.editedIngredient));
        $scope.update();
        $scope.cancelNewIngredient();
    };
    
    $scope.saveHop = function() {
        if (!$scope.beer.ingredients) {
            $scope.beer.ingredients = {};
        }
        if (!$scope.beer.ingredients.hops) {
            $scope.beer.ingredients.hops = [];
        }
        $scope.beer.ingredients.hops.push(angular.copy($scope.editedIngredient));
        $scope.update();
        $scope.cancelNewIngredient();
    };
    
    $scope.saveYeast = function() {
        if (!$scope.beer.ingredients) {
            $scope.beer.ingredients = {};
        }
        if (!$scope.beer.ingredients.yeasts) {
            $scope.beer.ingredients.yeasts = [];
        }
        $scope.beer.ingredients.yeasts.push(angular.copy($scope.editedIngredient));
        $scope.update();
        $scope.cancelNewIngredient();
    };
    
    $scope.saveMisc = function() {
        if (!$scope.beer.ingredients) {
            $scope.beer.ingredients = {};
        }
        if (!$scope.beer.ingredients.misc) {
            $scope.beer.ingredients.misc = [];
        }
        $scope.beer.ingredients.misc.push(angular.copy($scope.editedIngredient));
        $scope.update();
        $scope.cancelNewIngredient();
    };
    
    $scope.cancelNewIngredient = function() {
        $scope.editedIngredient = undefined;
        $scope.selectedIngredient = undefined;
        $scope.newIngredientType = undefined;
        $scope.update();
    };
    
    $scope.removeIngredient = function(index, type) {
        $scope.beer.ingredients[type].splice(index, 1);
        $scope.update();
    };
    
    $scope.updateBoilVolume = function() {
        if ($scope.beer && $scope.beer.equipment && $scope.beer.equipment.boiler.calculatBoilVolume) {
            var boiler = $scope.beer.equipment.boiler;
            boiler.boilVolume = $scope.beer.equipment.batchSize + boiler.boilOff + boiler.coolingLoss + boiler.kettleTopUp;
            boiler.postBoilVolume = boiler.boilVolume - boiler.boilOff - boiler.kettleTopUp;
        }
    };
    
    $scope.updateBoilVolume();

    $scope.waterToAdd = function(beer) {
        var maltWeight = 0;
        for (var index in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[index];
            if ((malt.type === 'malt' || malt.type === 'husk') && malt.recommendMash) {
                maltWeight += malt.amount;
            }
        }
        return (maltWeight / beer.mash.properties.waterGrainRatio)
    };
    
    $scope.update = function() {
        $scope.updateBoilVolume();
        Bitterness.tinseth($scope.beer);
        $scope.beer.og = Alcohol.calculateOriginalGravity($scope.beer);
        $scope.beer.fg = Alcohol.calculateFinalGravity($scope.beer);
        $scope.beer.abv = Alcohol.calculateABV($scope.beer);
        $scope.beer.color = ColorConversion.calculateTotalEBC($scope.beer);
        $scope.beerColor = $scope.getColor($scope.beer);
    };
    
    $scope.addToPublicList = function() {
        var ref = firebase.database().ref();
        var publicList = $firebaseArray(ref.child('beerlist/public'));
        publicList.$loaded().then(function(data) {
            var exists = false;
            for (var i = 0; i < publicList.length; i++) {
                if (publicList[i].beerId === $scope.beer.$id) {
                    exists = true;
                    break;
                }
            }
            if ($scope.beer.public && !exists) {
                var publicBeer = {beerId: $scope.beer.$id,
                                  owner: User.authData.uid,
                                  name: $scope.beer.name,
                                  style: parseInt($scope.beer.style),
                                  parentStyle: $scope.beer.parentStyle};
                publicList.$add(publicBeer);
            }
            publicList.$destroy();
        });
    };
    
    $scope.save = function() {
        Beer.saveBeer($scope.beer, User.authData.uid, function(ref) {
            $scope.addToPublicList();
            $scope.saved = true;
        }, function(ref) {
            $scope.addToPublicList();
            $scope.saved = true;
            $scope.added = true;
            $scope.key = ref.key();
        });
    };
    
    $scope.$watch(function() {
        return $scope.saved;
    }, function() {
        if ($scope.saved) {
            $interval(function() {
                $scope.saved = false;
            }, 2000, 1);
        }
    });
    
    $scope.$on("$destroy", function(){
        Page.setTitle("Beer Creator");
        if (!$scope.miscList) {
            return;
        }
        $scope.miscList.$destroy();
        $scope.yeastList.$destroy();
        $scope.hopList.$destroy();
        $scope.grainList.$destroy();
        $scope.styles.$destroy();
        $scope.equipmentList.$destroy();
        $scope.fermentationProfiles.$destroy();
        $scope.mashProfiles.$destroy();
    });
    
    
    $scope.openPublic = function(beer) {
        window.open('index.html#public/' + User.authData.uid + '/' + beer.$id, '_blank');
    };
    
    $scope.addMashStep = function(mash) {
        if (!mash) {
            return;
        }
        if (!mash.steps) {
            mash.steps = [];
        }
        mash.steps.push({});
    };
    
    $scope.addAging = function(fermentation) {
        fermentation.aging = {};
        if (fermentation.secondary) {
            fermentation.type = "Three stage";
        } else {
            fermentation.type = "Two stage";
        }
    };
    
    $scope.removeAging = function(fermentation) {
        fermentation.aging = undefined;
        if (fermentation.secondary) {
            fermentation.type = "Two stage";
        } else {
            fermentation.type = "One stage";
        }
    };
    
    $scope.addSecondary = function(fermentation) {
        fermentation.secondary = {};
        if (fermentation.aging) {
            fermentation.type = "Three stage";
        } else {
            fermentation.type = "Two stage";
        }
    };
    
    $scope.removeAging = function(fermentation) {
        fermentation.secondary = undefined;
        if (fermentation.aging) {
            fermentation.type = "Two stage";
        } else {
            fermentation.type = "One stage";
        }
    };

    $scope.overMaxInBatch = function(beer, ingredient) {
        var percentage = $scope.getPercentage(beer, ingredient);
        return percentage > (ingredient.maxInBatch * 100);
    };
    
}]);